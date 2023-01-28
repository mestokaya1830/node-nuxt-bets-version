const express = require('express')
const router = express.Router()
const Cryptr = require('cryptr')
const mysql = require('./db')
const fs = require('fs')
const osmosis = require('osmosis')
const cryptr = new Cryptr('myTotalySecretKey')
const  request = require('sync-request')
const cache = require('memory-cache')
const moment = require('moment')
const  fetch = require('node-fetch')
const memCache = new cache.Cache()
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key =  '__express__' + req.originalUrl || req.url
    const cacheContent = memCache.get(key)
    if(cacheContent){
        res.send( cacheContent )
        return
    }else{
      res.sendResponse = res.send
      res.send = (body) => {
        memCache.put(key,body,duration*1000)
        res.sendResponse(body)
      }
      next()
    }
  }
}

let logincount = 0
let ipAddr = ''
router.post('/login', (req, res) => {     
  let user = req.body.user
  const ip = req.headers['x-forwarded-for'] || 
  req.connection.remoteAddress || 
  req.socket.remoteAddress ||
  (req.connection.socket ? req.connection.socket.remoteAddress : null)
  ipAddr = ip
  if (user) {
    mysql.getConnection().then(conn => {
      conn.query('SELECT * FROM users WHERE user = ? LIMIT 1', [user], (err, result) => {
        if (!err) {
          if (result.length > 0) {
            const dePass = cryptr.decrypt(result[0].pass)
            if (req.body.pass === dePass) {
              if (result[0].state === 'pasif') {
                  res.json({ message: 'Hesap askıya alınmıştır' })
              } else if (result[0].logincheck === 'active' && result[0].multilogin === 0) {
                  res.json({ message: 'Hesap Aktif durumdadır!' })
              } else if (result[0].logincount >= 3) {
                  res.json({ message: 'Hatalı giriş sınırı!' })
              }else{
                //role u1 side
                if (result[0].role === 'U1'){
                  conn.query('SELECT sk, sa FROM timesettings WHERE user = ?',[result[0].user],(err, timesettings)=>{
                    if (!err) {
                      if (timesettings[0].sk !== null && new Date() > timesettings[0].sk && timesettings[0].sa !== null && new Date() < timesettings[0].sa) {
                        res.json({message: 'Giriş Kapalı'})
                      }else{insertLogin(conn, result[0])}
                    }
                  })
                }else{insertLogin(conn, result[0])}
              }
            }else{
              //password side
              logincount += 1
              if (logincount >= 3) {
                conn.query('UPDATE users SET logincount = ? WHERE user = ?', ['3', user], (err) => {
                  if (!err) {
                    res.json({ message: 'Hatalı giriş sınırı!' })
                  }
                })
              } else{
                conn.release()
                res.json({ message: 'Geçersiz üye' })
              }
            }
          }else{
            conn.release()
            res.json({ message: 'Geçersiz üye' })
          }
        }
      })
    })
    function insertLogin(conn, value){
      req.session.auth = value
      let loginlog = {
        user: value.user,
        admin: value.admin,
        superadmin: value.superadmin,
        date: new Date(),
        proccess: 'Online',
        ip: ipAddr
      }
      conn.query('UPDATE users SET logincheck = ? WHERE user = ?', ['active', user], (err) => {
        conn.release()
        if (!err) {
          conn.query('INSERT INTO loginlog SET  ?', [loginlog],(err)=>{
            if (!err) {
              res.json({ code: 200, message: 'Giriş Başarılı', auth: value})
            }
          })
        }
      })
    }
  } 
})
router.post('/logout', (req, res) => {
  if (req.session.auth) {
    let loginlog = {
      user: req.session.auth.user,
      admin: req.session.auth.admin,
      superadmin: req.session.auth.superadmin,
      date: new Date(),
      proccess: 'Offline',
      ip: ipAddr
    }
    mysql.getConnection().then(conn => {
      conn.query('UPDATE users SET logincheck = ? WHERE user = ?', ['passive', req.session.auth.user], (err) =>{
        if (!err) {
          conn.query('INSERT INTO loginlog SET  ?', [loginlog], (err) => {
            conn.release()
            if (!err) {
              delete req.session.auth
              res.json({ ok: true })
            }
          })
        }
      })
    })
  }
})
router.post('/resetpass', (req, res) => {
  mysql.getConnection().then(conn => {
    conn.query('Select user, nick FROM users WHERE user = ? LIMIT 1', [req.body.user], (err, result) => {
      if (!err) {
        if (result.length === 1) {
          let newPass = cryptr.encrypt(req.body.pass)
          if (req.body.nick === result[0].nick) {
            conn.query('UPDATE users SET pass = ?, logincheck = ?, logincount = ? WHERE user = ?', [newPass, 'passive',0 , req.body.user], (err) => {
              conn.release()
              if (!err) {
                res.json({ code: 200, message: 'Sıfırlama başarılı' } )
              }
            })
          } else {
            conn.release()
            return res.json({ message: 'Gecersiz nick' })
          }
        } else {
          conn.release()
          return res.json({ message: 'Gecersiz kullanici' })
        }
      }
    })
  })
})
router.post('/home/multilogin',(req, res)=>{
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query('UPDATE users SET multilogin = ? WHERE user = ?', [req.body.multilogin, req.session.auth.user], (err) => {
        conn.release()
        if (!err) {
          res.json({ code: 200} )
        }
      })
    })
  }
})
router.post('/home/account/register', (req, res) => {
  if (req.session.auth) {
    let setRole = null
    if (req.body.role === 'B4') {
      setRole = 'S3'
    } else if (req.body.role === 'S3') {
      setRole = 'A2'
    } else {
      setRole = 'U1'
    }
    mysql.getConnection().then(conn => {
      conn.query('SELECT admin, remain FROM users WHERE user = ? LIMIT 1', [req.body.admin], (err, result) => {
        if (!err && result[0].remain < 1) {
          res.json({code: 400, message: 'Limitiniz dolmuştur!'})
        } else {
          conn.query('SELECT user, nick FROM users WHERE user = ? || nick = ?  LIMIT 1', [req.body.user, req.body.nick], (err, users) => {
            if (!err && users.length > 0) {
              if (users[0].user === req.body.user) {
                res.json({ message: 'Bu Add kullanilmaktadir' })
              }else{
                res.json({ message: 'Bu Nick kullanilmaktadir' })
              }
            }else {
              var newUser = {
                user: req.body.user,
                nick: req.body.nick,
                pass: cryptr.encrypt(req.body.pass),
                admin: req.body.admin,
                superadmin: result[0].admin,
                credit: req.body.credit,
                creditused: 0,
                creditremain: req.body.credit,
                userlimit: req.body.userlimit,
                remain: req.body.remain,
                role: setRole,
                payment: new Date()
              }
              var creditlog = {
                user: req.body.user,
                admin: req.body.admin,
                superadmin: result[0].admin,
                date: new Date(),
                amount: req.body.credit,
                creditremain: req.body.credit,
                ope: 'Kredi',
                des: 'Kayit'
              }
              if (req.body.role === 'B4' || req.body.role === 'S3'){
                conn.query('INSERT INTO users SET ?', [newUser], (err) => {
                  if (!err){
                    conn.query('Update users Set remain = remain - 1 WHERE user = ?', [req.body.admin], (err) => {
                      conn.release()
                      if (!err) {
                        res.json({code: 200, message: 'Yeni kullanici eklendi'})
                      }
                    })
                  }
                })
              }else if (req.body.role === 'A2'){
                conn.query('INSERT INTO users SET ?', [newUser], (err) => {
                  if (!err){
                    conn.query('Update users Set remain = remain - 1 WHERE user = ?', [req.body.admin], (err) => {
                      if (!err) {
                        conn.query('INSERT INTO timesettings SET user = ?, admin = ?, superadmin = ?', [req.body.user, req.body.admin, result[0].admin],(err)=>{
                          if (!err) {
                            conn.query('INSERT INTO limitsettings SET user = ?, admin = ?, superadmin = ?', [req.body.user, req.body.admin, result[0].admin],(err)=>{
                              if (!err) {
                                conn.query('INSERT INTO creditlog SET ?', [creditlog],(err)=>{
                                  if (!err) {
                                    conn.query('ALTER TABLE leagues ADD '+ req.body.user +' BOOLEAN DEFAULT true',(err)=>{
                                      if (!err) {
                                        conn.query('ALTER TABLE liveleagues ADD '+ req.body.user +' BOOLEAN DEFAULT true',(err)=>{
                                          if (!err) {
                                            conn.query('ALTER TABLE markets ADD '+ req.body.user +' BOOLEAN DEFAULT true',(err)=>{
                                              if (!err) {
                                                conn.query('ALTER TABLE livemarkets ADD '+ req.body.user +' BOOLEAN DEFAULT true',(err)=>{
                                                  conn.release()
                                                  if (!err) {
                                                    return res.json({code: 200, message: 'Yeni kullanici eklendi'})
                                                  }
                                                })
                                              }
                                            })
                                          }
                                        })
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }else{
                return false
              }
            }
          })
        }
      })
    })
  }
})
router.get('/home/account/userlist', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query('CALL sp_userlist(?)', [req.session.auth.user], (err, userlist) => {
        conn.release()
        if (!err) {
          res.json({ userlist: userlist[0] })
        }
      })
    })
  }
})
router.get('/home/account/users', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then(conn => {
      conn.query('CALL sp_users(?)', [req.session.auth.user], (err, users) => {
        conn.release()
        if (!err) {
            res.json({ users: users[0] })
          }
        }
      )
    })
  }
})
router.get('/home/account/users/:id', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then(conn => {
      conn.query('SELECT * FROM users WHERE user =? LIMIT 1', [req.params.id], (err, users) => {
        conn.release()
        if (!err) {
          res.json({ users: users[0] })
        }
      })
    })
  }
})
router.get('/home/account/profile', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then(conn => {
      conn.query('SELECT user, nick, role, credit, creditremain, date, payment, userlimit, remain, state FROM users WHERE user = ? LIMIT 1', [req.session.auth.user], (err, profile) => {
        conn.release()
        if (!err) {
          res.json({profile: profile[0]})
        }
      })
    })
  }
})
router.delete('/home/account/usersdelete/:id', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then(conn => {
      if (req.session.auth.role === 'A2') {
        conn.query('Update users Set remain = remain + 1 WHERE user = ?', [req.session.auth.user], (err) => {
          if (!err) {
            conn.query('DELETE FROM limitsettings WHERE user =?', [req.params.id])
            conn.query('DELETE FROM timesettings WHERE user =?', [req.params.id])
            conn.query('DELETE FROM creditlog WHERE user =?', [req.params.id])    
            conn.query('DELETE FROM loginlog WHERE user = ?', [req.params.id]) 
            conn.query('DELETE FROM bets WHERE user =?', [req.params.id])
            conn.query('DELETE FROM betsummary WHERE user =?', [req.params.id])
            conn.query(`ALTER TABLE leagues DROP COLUMN ${req.params.id}`)
            conn.query(`ALTER TABLE liveleagues DROP COLUMN ${req.params.id}`)
            conn.query(`ALTER TABLE markets DROP COLUMN ${req.params.id}`)
            conn.query(`ALTER TABLE livemarkets DROP COLUMN ${req.params.id}`)
            conn.query('DELETE FROM users  WHERE user =?', [req.params.id], (err) => {
              conn.release()
              if (!err) {
                res.json({ message: 'Kullanıcı başarıyla silindi' })
              }
            })
          }                                       
        })
      }else if (req.session.auth.role === 'S3') {
        conn.query('Update users Set remain = remain + 1 WHERE user = ?', [req.session.auth.user],(err, result) => {
          if (!err) {
            conn.query('SELECT user FROM users WHERE admin = ?', [req.params.id], (err, result) =>{
              if (!err) {
                if (result.length > 0) {
                  conn.query('DELETE FROM limitsettings WHERE admin = ?', [req.params.id])
                  conn.query('DELETE FROM timesettings WHERE admin = ?', [req.params.id])
                  conn.query('DELETE FROM creditlog WHERE admin = ?', [req.params.id])
                  conn.query('DELETE FROM loginlog WHERE admin = ?', [req.params.id])
                  conn.query('DELETE FROM loginlog WHERE user = ?', [req.params.id])
                  conn.query('DELETE FROM bets WHERE admin = ?', [req.params.id])
                  conn.query('DELETE FROM betsummary WHERE admin = ?', [req.params.id])
                  let newArray = []
                  result.forEach(item => {
                    newArray.push('DROP COLUMN '+ item.user)
                  })
                  setTimeout(() => {
                    conn.query(`ALTER TABLE leagues ${newArray}`)
                    conn.query(`ALTER TABLE liveleagues ${newArray}`)
                    conn.query(`ALTER TABLE markets ${newArray}`)
                    conn.query(`ALTER TABLE livemarkets ${newArray}`)
                    conn.query('DELETE FROM users WHERE admin = ?', [req.params.id])
                    conn.query('DELETE FROM users WHERE user = ?', [req.params.id],(err) => {
                      conn.release()
                      if (!err) {
                        res.json({ message: 'Kullanıcı başarıyla silindi' })
                      }
                    })
                  }, 100)
                }else{
                  //delete direct user
                  conn.query('DELETE FROM loginlog WHERE user = ?', [req.params.id])
                  conn.query('DELETE FROM users WHERE user = ?', [req.params.id],(err) => {
                    conn.release()
                    if (!err) {
                      res.json({ message: 'Kullanıcı başarıyla silindi' })
                    }
                  })
                }
              }
            })
          }
        })
      }else if (req.session.auth.role === 'B4') {
        conn.query('Update users Set remain = remain + 1 WHERE user = ?', [req.session.auth.user],(err, result) => {
          if (!err) {
            conn.query('SELECT user FROM users WHERE admin =?', [req.params.id], (err, result) =>{
              if (!err && result.length > 0) {
                conn.query('SELECT user FROM users WHERE superadmin =?', [req.params.id], (err, result) =>{
                  if (!err && result.length > 0) {
                    conn.query('DELETE FROM limitsettings WHERE superadmin = ?', [req.params.id])
                    conn.query('DELETE FROM timesettings WHERE superadmin = ?', [req.params.id])
                    conn.query('DELETE FROM creditlog WHERE superadmin = ?', [req.params.id])
                    conn.query('DELETE FROM loginlog WHERE superadmin = ?', [req.params.id])
                    conn.query('DELETE FROM loginlog WHERE admin = ?', [req.params.id])
                    conn.query('DELETE FROM loginlog WHERE user = ?', [req.params.id])
                    conn.query('DELETE FROM bets WHERE superadmin = ?', [req.params.id])
                    conn.query('DELETE FROM betsummary WHERE superadmin = ?', [req.params.id])
                    let newArray = []
                    result.forEach(item => {
                      newArray.push('DROP COLUMN '+ item.user)
                    })
                    setTimeout(() => {
                      conn.query(`ALTER TABLE leagues ${newArray}`)
                      conn.query(`ALTER TABLE liveleagues ${newArray}`)
                      conn.query(`ALTER TABLE markets ${newArray}`)
                      conn.query(`ALTER TABLE livemarkets ${newArray}`)
                      conn.query('DELETE FROM users WHERE superadmin = ?', [req.params.id])
                      conn.query('DELETE FROM users WHERE admin = ?', [req.params.id])
                      conn.query('DELETE FROM users WHERE user = ?', [req.params.id],(err) => {
                        conn.release()
                        if (!err) {
                          res.json({ message: 'Kullanıcı başarıyla silindi' })
                        }
                      })
                    }, 100)
                  }else{
                    //delete  user and admin
                    conn.query('DELETE FROM loginlog WHERE admin = ?', [req.params.id])
                    conn.query('DELETE FROM loginlog WHERE user = ?', [req.params.id])
                    conn.query('DELETE FROM users WHERE admin = ?', [req.params.id])
                    conn.query('DELETE FROM users WHERE user = ?', [req.params.id],(err) => {
                      conn.release()
                      if (!err) {
                        res.json({ message: 'Kullanıcı başarıyla silindi' })
                      }
                    })
                  }
                })
              }else{
                //delete direct user
                conn.query('DELETE FROM loginlog WHERE user = ?', [req.params.id])
                conn.query('DELETE FROM users WHERE user = ?', [req.params.id],(err) => {
                  conn.release()
                  if (!err) {
                    res.json({ message: 'Kullanıcı başarıyla silindi' })
                  }
                })
              }
            })
          }
        })
      }else{return false}
    })
  }
})
router.post('/home/account/users/updatecredit/:id', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then(conn => {
      conn.query('SELECT creditused FROM users WHERE user = ? LIMIT 1',[req.params.id],(err, result)=>{
        if (!err) {
          if (req.body.credit < result[0].creditused) {
            res.json({code: 201, message: 'Yeni kredi kullanılan krediden az olamaz!'})
          } else {
            conn.query('UPDATE users SET credit = ?, creditremain = credit - creditused WHERE user = ?', [req.body.credit, req.params.id], (err) => {
              if (!err) {
                conn.query('SELECT creditremain FROM users WHERE user = ? LIMIT 1', [req.params.id], (err, result) => {
                  if (!err) {
                    let creditlog = {
                      user: req.params.id,
                      admin: req.session.auth.user,
                      date: new Date(),
                      amount: req.body.credit,
                      creditremain: result[0].creditremain,
                      ope: 'Kredi',
                      des: 'Güncelleme'
                    }
                    conn.query('INSERT INTO creditlog SET ?', [creditlog],(err) => {
                      conn.release()
                      if (!err) {
                        res.json({code: 200})
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    })
  }
})
router.post('/home/account/users/state/:id', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then(conn => {
      if (req.session.auth.role === 'A2') {
        conn.query('UPDATE users SET state = ? WHERE user = ?', [req.body.state, req.params.id], (err) => {
          conn.release()
          if (!err) {
            res.json({code: 200})
          }
        })
      }else if(req.session.auth.role === 'S3'){
        conn.query('UPDATE users SET state = ? WHERE admin = ?', [req.body.state, req.params.id], (err) => {
          if (!err) {
            conn.query('UPDATE users SET state = ? WHERE user = ?', [req.body.state, req.params.id], (err) => {
              conn.release()
              if (!err) {
                res.json({code: 200})
              }
            })
          }
        })
      }else{
        conn.query('UPDATE users SET state = ? WHERE superadmin = ?', [req.body.state, req.params.id], (err) => {
          if (!err) {
            conn.query('UPDATE users SET state = ? WHERE admin = ?', [req.body.state, req.params.id], (err) => {
              if (!err) {
                conn.query('UPDATE users SET state = ? WHERE user = ?', [req.body.state, req.params.id], (err) => {
                  conn.release()
                  if (!err) {
                    res.json({code: 200})
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})
router.post('/home/account/users/payment/:id', (req, res) => {
  if (req.session.auth) {
    let currentDate = new Date()
    mysql.getConnection().then(conn => {
      conn.query('UPDATE users SET payment = ? WHERE user = ?', [currentDate, req.params.id], (err) => {
        conn.release()
        if (!err) {
          res.json({code: 200})
        }
      })
    })
  }
})
router.post('/home/account/updateprofile', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then(conn => {
      conn.query('UPDATE users SET nick = ? WHERE user = ?', [req.body.nick, req.session.auth.user], (err) => {
        conn.release()
        if (!err) {
            res.json({code: 200})
          } else {
            res.json({ message: 'Bu nick kullanılmaktadır' })
        }
      })
    })
  }
})
router.post('/addbet', (req, res) => {
  if (req.session.auth) {
    if (req.session.auth.role === 'U1') {
      const newBet = req.body.slips
      const bets = []
      for (const key in newBet) {
        bets.push([
          newBet[key].betref,
          newBet[key].code,
          newBet[key].user,
          newBet[key].admin,
          newBet[key].superadmin,
          newBet[key].match,
          newBet[key].games,
          newBet[key].option,
          newBet[key].rate,
          newBet[key].stream,
          newBet[key].branch,
          newBet[key].state,
          newBet[key].scoreid
        ])
      }
      let totalRate = 1
      for (const key in bets) {
        totalRate  *= bets[key][8]
      }
      let newSummary = req.body.slipSummary
      const betSummary = {
        betref: newSummary.betref,
        user: newSummary.user,
        admin: newSummary.admin,
        superadmin: newSummary.superadmin,
        betscount: bets.length,
        betscountremain: bets.length,
        amount: newSummary.amount,
        rate: totalRate,
        earn: newSummary.amount * totalRate,
        owner: newSummary.owner,
        state: 'Aktif',
      }
      mysql.getConnection().then((conn) => {
        conn.query('CALL sp_addbet1(?)', [req.session.auth.user], (err, result) => {
          if (!err) {
            if (result[0][0].creditremain < newSummary.amount) {
              return res.json({code: 401, message: 'Yetersiz kredi'})
            } else {
              conn.query('INSERT INTO betsummary SET ?', [betSummary], (err) => {
                if(!err) {
                  conn.query('INSERT INTO bets (betref, code, user, admin, superadmin, matches, games, options, rate, stream, branch, state, scoreid) VALUES ?', [bets], (err) => {
                    if (!err) {
                      conn.query('UPDATE users SET  creditused = creditused + '+ newSummary.amount +', creditremain = credit - creditused WHERE user = ?', [req.session.auth.user], (err) => {
                        if (!err) {
                          setTimeout(() => {
                            conn.query('CALL sp_addbet2(?)', [req.session.auth.user], (err, users) => {
                              if (!err) {
                                let creditlog = {
                                  user: users[0][0].user, 
                                  admin: users[0][0].admin,
                                  superadmin: users[0][0].superadmin,
                                  date: new Date(),
                                  amount: newSummary.amount,
                                  creditremain: users[0][0].creditremain,
                                  ope: 'Eksildi',
                                  des: 'Kupon'
                                }
                                conn.query('INSERT INTO creditlog SET ?', [creditlog],(err) => {
                                  conn.release()
                                  if (!err) {
                                    res.json({message: 'Kupon basarıyla eklendi', credit: result[0][0].credit, creditremain: result[0][0].creditremain})
                                  }
                                })
                              }
                            }) 
                          }, 1000)
                        }
                      })
                    }
                  })
                }
              })
            }
          }
        })
      })
    }
  }
})
router.post('/home/account/betsummary',(req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) =>{
      if (req.session.auth.role === 'U1') {
        if (req.body.statebox === 'Hepsi') {
          conn.query('CALL sp_betsum1(?)', [req.session.auth.user], (err, betsummary) => {
            conn.release()
            if (!err) {
              res.json({betsummary: betsummary[0]}) 
            }
          })
        }else {
          conn.query('CALL sp_betsum2(?,?)', [req.session.auth.user, req.body.statebox], (err, betsummary) => {
            conn.release()
            if (!err) {
              res.json({betsummary: betsummary[0]}) 
            }
          })
        }
      }else if(req.session.auth.role === 'A2'){
        if (req.body.userbox === 'Üyeler'){
          if (req.body.statebox === 'Hepsi') {
            conn.query('CALL sp_betsum3(?)', [req.session.auth.user], (err, betsummary) => {
              conn.release()
              if (!err) {
                res.json({betsummary: betsummary[0]})
              }
            })
          } else {
            conn.query('CALL sp_betsum4(?,?)', [req.session.auth.user, req.body.statebox], (err, betsummary) => {
              conn.release()
              if (!err) {
                res.json({betsummary: betsummary[0]})
              }
            })
          }
        }else{
          if (req.body.statebox === 'Hepsi') {
            conn.query('CALL sp_betsum5(?)', [req.body.userbox], (err, betsummary) => {
              conn.release()
              if (!err) {
                res.json({betsummary: betsummary[0]}) 
              }
            })
          } else {
            conn.query('CALL sp_betsum6(?,?)', [req.body.userbox, req.body.statebox], (err, betsummary) => {
              conn.release()
              if (!err) {
                res.json({betsummary: betsummary[0]}) 
              }
            })
          }
        }
      }
    })
  }
})
router.get('/home/account/betsummary/:id', (req, res) => {
  if (req.session.auth) {
    betref = req.params.id
    mysql.getConnection().then((conn) => {
      conn.query('CALL sp_betsumid(?)', [req.params.id], (err, bets) => {
        conn.release()
        if (!err) {
          res.json({bets: bets[0]})
        }
      })
    })
  }
})
router.post('/home/account/setbetstate', (req, res) => {
  if (req.session.auth) {
    if (req.session.auth.role !== 'U1') {
      let rbb = req.body.betdetail
        mysql.getConnection().then((conn) =>{
          conn.query('SELECT state FROM bets WHERE id = ? LIMIT 1', [rbb.id],(err, result)=>{
            conn.release()
            if (!err) {
              conn.query('UPDATE bets SET state = ? WHERE id = ?', [rbb.state, rbb.id],(err)=>{
                if (!err) {
                  if (result[0].state === 'Aktif' && rbb.state === 'Kazandi' || result[0].state === 'Aktif' && rbb.state === 'Kaybetti'){
                    conn.query('UPDATE betsummary SET betscountremain = betscountremain - 1 WHERE betref = ?', [req.body.betsum.betref],(err)=>{
                      if (!err) {
                        res.json({code: 200})
                      }
                    })
                  }else if(result[0].state === 'Kazandi' && rbb.state === 'Aktif' || result[0].state === 'Kaybetti' && rbb.state === 'Aktif'){
                    conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE betref = ?', [req.body.betsum.betref],(err)=>{
                      if (!err) {
                        res.json({code: 200})
                      }
                    })
                }else {
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain WHERE betref = ?', [req.body.betsum.betref],(err)=>{
                    if (!err) {
                      res.json({code: 200})
                    }
                  })
                }
              }
            })
          }
        })
      })
    }
  }
})
router.post('/home/account/setbetsummarystate', (req, res) =>{
  if (req.session.auth) {
    let betsum = req.body.betsum
    let betstate = req.body.betstate
    let ope = ''
    let des = ''
    mysql.getConnection().then((conn) =>{
      conn.query('SELECT state FROM betsummary WHERE betref = ? LIMIT 1', [betsum.betref],(err, result)=>{
        conn.release()
        if (!err) {
          conn.query('UPDATE betsummary SET state = ? WHERE betref = ?', [betstate, betsum.betref],(err)=>{
            if (!err) {
              if (result[0].state === 'Aktif' && betstate === 'Kaybetti') {
                res.json({code: 200, message: 'lost'})
              }else if(result[0].state === 'Kaybetti' && betstate === 'Aktif'){
                res.json({code: 200, message: 'Aktif'})
              }else if(betstate === 'Kazandi'){
                conn.query('UPDATE users SET creditused = creditused - '+ betsum.earn +', creditremain = credit - creditused WHERE user = ?',[betsum.user], (err) => {
                  if (!err) {
                    ope = 'Eklendi'
                    des = 'Kazandi'
                    insertCreditLog(betsum.user, betsum.earn, ope, des)
                  }
                })
              }else if(result[0].state === 'Kazandi' && betstate === 'Aktif' || result[0].state === 'Kazandi' && betstate === 'Kaybetti'){
                conn.query('UPDATE users SET creditused = creditused + '+ betsum.earn +', creditremain = credit - creditused WHERE user = ?',[betsum.user], (err) => {
                  if (!err) {
                    ope = 'Eksildi'
                    des = 'Düzeltme'
                    insertCreditLog(betsum.user, betsum.earn, ope, des)
                  }
                })
              }else{
                res.json({code: 200, message: 'active'})
              }
            }
          })
        }
      })
      function insertCreditLog (user, earn, ope, des){
        conn.query('SELECT creditremain FROM users WHERE user = ?', [betsum.user], (err, users) => {
          if (!err) {
            let creditlog = {
              user: user,
              admin: req.session.auth.user,
              superadmin: req.session.auth.admin,
              date: new Date(),
              amount: earn,
              creditremain: users[0].creditremain,
              ope: ope,
              des: des
            }
            conn.query('INSERT INTO creditlog SET ?', [creditlog],(err)=> {
              if (!err) {
                res.json({code: 200})
              }
            })
          } 
        })
      }
    })
  }
})
router.post('/home/account/paymentbet', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      if (req.session.auth.role === 'U1') {
        conn.query('UPDATE betsummary SET payment = ? WHERE betref = ?', [req.body.value, req.body.betref], (err) => {
          conn.release()
          if (!err) {
            res.json({code: 200})
          }
        })
      }
    })
  }
})
router.post('/home/account/resetaccount', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query('SELECT COUNT(betref) AS count FROM betsummary WHERE user =? And state = ?', [req.body.userbox, 'Aktif'], (err, activecount) => {
        conn.release()
        if (!err) {
          if (activecount[0].count === 0) {
            conn.query('UPDATE users SET creditused = 0, creditremain = credit WHERE user =?', [req.body.userbox], (err) => {
              if (!err) {
                conn.query('INSERT INTO betsummaryhistory SELECT * FROM betsummary WHERE user = ?',[req.body.userbox],(err)=>{
                  if (!err) {
                    conn.query('INSERT INTO betshistory SELECT * FROM bets WHERE user = ?',[req.body.userbox],(err)=>{
                      if (!err) {
                        conn.query('DELETE FROM betsummary WHERE user = ?',[req.body.userbox],(err)=>{
                          if (!err) {
                            conn.query('DELETE FROM bets WHERE user = ?',[req.body.userbox],(err)=>{
                              if (!err) {
                                res.json({code: 200, message: 'Hesap sıfırlandı'})
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          } else {res.json({ message: 'Aktif kuponunuz var!' })}
        }
      })
    })
  }
})
router.get('/home/account/comission', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query('SELECT comission FROM users WHERE user = ? LIMIT 1', [req.session.auth.user], (err, comissionrate) => {
        conn.release()
        if (!err) {
          res.json({ comissionrate: comissionrate })
        }
      })
    })
  }
})
router.post('/home/account/comissionupdate', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query('UPDATE users SET comission = ? WHERE user = ?', [req.body.comission, req.session.auth.user], (err, comissionrate) => {
        conn.release()
        if (!err) {
          res.json({ code: 200 , message:'Güncelleme Başarılı'})
        }else {
          res.json({ message: 'Bir Hata Oluştu!'})
        }
      })
    })
  }
})
router.post('/home/account/creditinfo', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
    if (req.session.auth.role === 'U1') {
      conn.query('CALL sp_creditinfo1(?)', [req.session.auth.user], (err, creditinfo) => {
        conn.release()
        if (!err) {
          res.json({ creditinfo: creditinfo[0][0]})
        }
      })
    } else {
      if (req.body.userbox === 'Üyeler') {
        conn.query('CALL sp_creditinfo2(?)', [req.session.auth.user], (err, creditinfo) => {
          conn.release()
          if (!err) {
            res.json({ creditinfo: creditinfo[0][0]})
          }
        })
      } else {
        conn.query('CALL sp_creditinfo3(?)', [req.body.userbox], (err, creditinfo) => {
          conn.release()
          if (!err) {
            res.json({ creditinfo: creditinfo[0][0]})
          }
        })
      }
    }
  })
}
})
router.post('/home/account/activeinfo', (req, res) => {
  if (req.session.auth){
    mysql.getConnection().then((conn) =>{
      if (req.session.auth.role === 'U1') {
        conn.query('CALL sp_activeinfo1(?,?)', [req.session.auth.user, 'Aktif'], (err, activeinfo) => {
          conn.release()
          if (!err) {
            res.json({activeinfo: activeinfo[0][0]}) 
          }
        })
      } else {
        if (req.body.userbox === 'Üyeler'){
          conn.query('CALL sp_activeinfo2(?,?)', [req.session.auth.user, 'Aktif'], (err, activeinfo) => {
            conn.release()
            if (!err) {
              res.json({activeinfo: activeinfo[0][0]})
            }
          })
        } else {
          conn.query('CALL sp_activeinfo3(?,?)', [req.body.userbox, 'Aktif'], (err, activeinfo) => {
            conn.release()
            if (!err) {
              res.json({activeinfo: activeinfo[0][0]})
            }
          })
        }
      }
    })
  }
})
router.post('/home/account/woninfo', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
    if (req.session.auth.role === 'U1') {
      conn.query('CALL sp_wonlostinfo1(?,?)', [req.session.auth.user, 'Kazandi'], (err, woninfo) => {
        conn.release()
        if (!err) {
          if (woninfo[0].length > 0) {
            res.json({ woninfo: woninfo[0]})
          }
        }
      })
      } else {
        if (req.body.userbox === 'Üyeler'){
          conn.query('CALL sp_wonlostinfo2(?,?)', [req.session.auth.user, 'Kazandi'], (err, woninfo) => {
            conn.release()
            if (!err) {
              res.json({woninfo: woninfo[0]})
            }
          })
        }else {
          conn.query('CALL sp_wonlostinfo1(?,?)', [req.body.userbox, 'Kazandi'], (err, woninfo) => {
            conn.release()
            if (!err) {
              if (woninfo[0].length > 0) {
                res.json({ woninfo: woninfo[0]})
              }
            }
          })
        }
      }
    })
  }
})
router.post('/home/account/lostinfo', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
    if (req.session.auth.role === 'U1') {
      conn.query('CALL sp_wonlostinfo1(?,?)', [req.session.auth.user, 'Kaybetti'], (err, lostinfo) => {
        conn.release()
        if (!err) {
          if (lostinfo[0].length > 0) {
            res.json({ lostinfo: lostinfo[0]})
          }
        }
      })
      } else {
        if (req.body.userbox === 'Üyeler'){
          conn.query('CALL sp_wonlostinfo2(?,?)', [req.session.auth.user, 'Kaybetti'], (err, lostinfo) => {
            conn.release()
            if (!err) {
              res.json({lostinfo: lostinfo[0]})
            }
          })
        }else {
          conn.query('CALL sp_wonlostinfo1(?,?)', [req.body.userbox, 'Kaybetti'], (err, lostinfo) => {
            conn.release()
            if (!err) {
              if (lostinfo[0].length > 0) {
                res.json({ lostinfo: lostinfo[0]})
              }
            }
          })
        }
      }
    })
  }
})
router.post('/home/account/totalinfo', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
    if (req.session.auth.role === 'U1') {
      conn.query('CALL sp_totalinfo1(?)', [req.session.auth.user], (err, totalinfo) => {
        conn.release()
        if (!err) {
          if (totalinfo[0].length > 0) {
            res.json({ totalinfo: totalinfo[0]})
          }
        }
      })
      } else {
        if (req.body.userbox === 'Üyeler'){
          conn.query('CALL sp_totalinfo2(?)', [req.session.auth.user], (err, totalinfo) => {
            conn.release()
            if (!err) {
              if (totalinfo[0].length > 0) {
                res.json({ totalinfo: totalinfo[0]})
              }
            }
          })
        }else {
          conn.query('CALL sp_totalinfo1(?)', [req.body.userbox], (err, totalinfo) => {
            conn.release()
            if (!err) {
              if (totalinfo[0].length > 0) {
                res.json({ totalinfo: totalinfo[0]})
              }
            }
          })
        }
      }
    })
  }
})
router.post('/home/account/timesettings', (req, res) => {
  if (req.session.auth) {
    if (req.body.userbox !=='Üyeler') {
      mysql.getConnection().then((conn) => {
        conn.query('CALL sp_time(?)', [req.body.userbox], (err, timesettings) => {
          conn.release()
          if (!err) {
            res.json({ timesettings: timesettings[0][0] })
          }
        })
      })
    }
  }
})
router.post('/home/account/limitsettings', (req, res) => {
  if (req.session.auth) {
    if (req.body.userbox !=='Üyeler') {
      mysql.getConnection().then((conn) => {
        conn.query('CALL sp_limit(?)', [req.body.userbox], (err, limitsettings) => {
          conn.release()
          if (!err) {
            res.json({ limitsettings: limitsettings[0][0] })
          }
        })
      })
    }
  }
})
router.post('/home/account/updatetimesettings', (req, res) => {
  if(req.session.auth) {
    mysql.getConnection().then((conn) => {
      let value = req.body.value
      if (req.body.column === 'sk' || req.body.column === 'sa') {
        value = moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
      if (req.body.userbox === 'Üyeler') {
        conn.query('UPDATE timesettings SET '+req.body.column +' = ? WHERE admin =?', [value, req.session.auth.user], (err) => {
          conn.release()
          if (!err) {
            res.json({ code: 200} )
          }
        })
      } else {
        conn.query('UPDATE timesettings SET '+ req.body.column +' = ? WHERE user =?', [value, req.body.userbox], (err) => {
          if (!err) {
            res.json({ code: 200} )
          }
        })
      }
    })
  }
})
router.post('/home/account/updatelimitsettings', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      if (req.body.userbox === 'Üyeler') {
        conn.query('UPDATE limitsettings SET '+req.body.column +' = ? WHERE admin = ?', [req.body.value, req.session.auth.user], (err) => {
          conn.release()
          if (!err) {
            res.json({ code: 200} )
          }
        })
      } else {
        conn.query('UPDATE limitsettings SET '+req.body.column +' = ? WHERE user =?', [req.body.value, req.body.userbox], (err) => {
          if (!err) {
            res.json({ code: 200} )
          }
        })
      }
    })
  }
})
router.post('/home/account/betsummary/datefilter', (req, res) => {
  mysql.getConnection().then((conn) => {
    if (req.session.auth.role === 'U1') {
      if (req.body.statebox === 'Hepsi') {
        conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND date BETWEEN ? AND ? ORDER BY date DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish], (err, datefilter) => {
          conn.release()
          if (!err) {
            res.json({code: 200, datefilter: datefilter})
          }
        })
      }else {
        conn.query('SELECT * FROM betsummaryhistory WHERE user =? AND state = ? AND date BETWEEN ? AND ? ORDER BY date DESC', [req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish], (err, datefilter) => {
          conn.release()
          if (!err) {
            res.json({code: 200, datefilter: datefilter})
          }
        })
      }
    } else {
      if (req.body.userbox === 'Üyeler') {
        if (req.body.statebox === 'Hepsi') {
          conn.query('SELECT * FROM betsummaryhistory WHERE admin = ? AND date BETWEEN ? AND ? ORDER BY date DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish], (err, datefilter) => {
            conn.release()
            if (!err) {
              res.json({code: 200, datefilter: datefilter})
            }
          })
        }else{
          conn.query('SELECT * FROM betsummaryhistory WHERE admin =? AND state = ? AND date BETWEEN ? And ? ORDER BY date DESC', [req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish], (err, datefilter) => {
            conn.release()
            if (!err) {
              res.json({code: 200, datefilter: datefilter})
            }
          })
        }
      } else {
        if (req.body.statebox === 'Hepsi') {
          conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND date BETWEEN ? AND ? ORDER BY date DESC', [req.body.userbox, req.body.datestart, req.body.datefinish], (err, datefilter) => {
            conn.release()
            if (!err) {
              res.json({code: 200, datefilter: datefilter})
            }
          })
        }else {
          conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND admin = ? AND state = ? AND date BETWEEN ? AND ? ORDER BY date DESC', [req.body.userbox, req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish], (err, datefilter) => {
            conn.release()
            if (!err) {
              res.json({code: 200, datefilter: datefilter})
            }
          })
        }
      }
    } 
  })
})
router.post('/home/account/cancelbet', (req, res) => {
  mysql.getConnection().then((conn) => {
    conn.query('UPDATE betsummary SET state = ? WHERE betref = ?', ['iptal', req.body.betref], (err) => {  
      conn.release()
      if (!err) {
        conn.query('UPDATE bets SET state = ? WHERE betref = ?', ['iptal', req.body.betref], (err) => {
          if (!err) {
            conn.query('UPDATE users SET creditused = creditused - '+ req.body.amount +', creditremain = creditremain + '+ req.body.amount +' WHERE user = ?', [req.body.user], (err) => {
              if (!err) {
                conn.query('SELECT admin, user, amount FROM betsummary WHERE betref = ?', [req.body.betref], (err, betsummary) => {
                  if (!err) {
                    conn.query('SELECT creditremain FROM users WHERE user = ?', [betsummary[0].user], (err, users) => {
                      if (!err) {
                        let creditlog = {
                          user: betsummary[0].user, 
                          admin: betsummary[0].admin,
                          date: new Date(),
                          amount: betsummary[0].amount,
                          creditremain: users[0].creditremain,
                          ope: 'Eklendi',
                          des: 'iptal'
                        }
                        conn.query('INSERT INTO creditlog SET ?', [creditlog])
                        conn.query('UPDATE limitsettings SET maxkisremain = maxkisremain + 1 WHERE user = ?', [req.body.user],(err)=>{
                          if (!err) {
                            res.json({code: 200, message: 'Kupon iptal edildi'})
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  })
})
router.post('/home/account/creditlog', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
    if (req.session.auth.role === 'U1') {
      conn.query('SELECT id, user, admin, date, amount, creditremain, ope, des FROM creditlog WHERE user = ? ORDER BY date DESC LIMIT 50', [req.session.auth.user], (err, creditlog) => {
        conn.release()
        if (!err) {
          res.json({ creditlog: creditlog})
        }
      })
      } else {
        conn.query('SELECT id, user, admin, date, amount, creditremain, ope, des FROM creditlog WHERE user =? ORDER BY date DESC LIMIT 50', [req.body.userbox], (err, creditlog) => {
          conn.release()
          if (!err) {
            res.json({ creditlog: creditlog})
          }
        })
      }
    })
  }
})
router.post('/home/account/creditlogall', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
    if (req.session.auth.role === 'U1') {
      conn.query('SELECT id, user, admin, date, amount, creditremain, ope, des FROM creditlog WHERE user =? And id < ? ORDER BY date DESC LIMIT 50', [req.session.auth.user, req.body.lastid], (err, creditlog) => {
        conn.release()
        if (!err) {
          res.json({ creditlog: creditlog})
        }
      })
      } else {
        conn.query('SELECT id, user, admin, date, amount, creditremain, ope, des FROM creditlog WHERE user =? And id < ? ORDER BY date DESC LIMIT 50', [req.body.userbox, req.body.lastid], (err, creditlog) => {
          conn.release()
          if (!err) {
            res.json({ creditlog: creditlog})
          }
        })
      }
    })
  }
})
router.post('/home/account/creditlog/datefilter', (req, res) => {
  if (req.session.auth.user) {
    mysql.getConnection().then((conn) => {
      if (req.session.auth.role === 'U1') {
        conn.query('SELECT user, admin, date, amount, creditremain, ope, des FROM creditlog WHERE user = ? And date BETWEEN ? And ? ORDER BY id DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish], (err, datefilter) => {
          conn.release()
          if (!err) {
            res.json({datefilter: datefilter})
          }
        })
      }else {
        conn.query('SELECT user, admin, date, amount, creditremain, ope, des FROM creditlog WHERE user = ? And admin = ? And date BETWEEN ? And ? ORDER BY id DESC', [req.body.userbox, req.session.auth.user, req.body.datestart, req.body.datefinish], (err, datefilter) => {
          conn.release()
          if (!err) {
            res.json({datefilter: datefilter})
          }
        })
      }
    })
  }
})
router.post('/home/account/loginlog', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
    if (req.session.auth.role === 'U1') {
      conn.query('SELECT id, user, admin, date, proccess, ip FROM loginlog WHERE user =? ORDER BY date DESC LIMIT 50', [req.session.auth.user], (err, loginlog) => {
        conn.release()
        if (!err) {
          res.json({ loginlog: loginlog})
        }
      })
      } else {
        conn.query('SELECT id, user, admin, date, proccess, ip FROM loginlog WHERE user = ? ORDER BY date DESC LIMIT 50', [req.body.userbox], (err, loginlog) => {
          conn.release()
          if (!err) {
            res.json({ loginlog: loginlog})
          }
        })
      }
    })
  }
})
router.post('/home/account/loginlogall', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
    if (req.session.auth.role === 'U1') {
      conn.query('SELECT id, user, admin, date, proccess, ip FROM loginlog WHERE user =? And id < ? ORDER BY date DESC LIMIT 50', [req.session.auth.user, req.body.lastid], (err, loginlog) => {
        conn.release()
        if (!err) {
          res.json({ loginlog: loginlog})
        }
      })
      } else {
        conn.query('SELECT id, user, admin, date, proccess, ip FROM loginlog WHERE user =? And id < ?  ORDER BY date DESC LIMIT 50', [req.body.userbox, req.body.lastid], (err, loginlog) => {
          conn.release()
          if (!err) {
            res.json({ loginlog: loginlog})
          }
        })
      }
    })
  }
})
router.post('/home/account/loginlog/datefilter', (req, res) => {
  if (req.session.auth.user) {
    mysql.getConnection().then((conn) => {
      if (req.session.auth.role === 'U1') {
        conn.query('SELECT user, admin, date, proccess, ip FROM loginlog WHERE user =? And date BETWEEN ? And ? ORDER BY id DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish], (err, datefilter) => {
          conn.release()
          if (!err) {
            res.json({datefilter: datefilter})
          }
        })
      } else {
        if (req.body.userbox === 'Üyeler') {
          conn.query('SELECT user, admin, date, proccess, ip FROM loginlog WHERE admin =? And date BETWEEN ? And ? ORDER BY id DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish], (err, datefilter) => {
            if (!err) {
              res.json({datefilter: datefilter})
            }
          })
        } else {
          conn.query('SELECT user, admin, date, proccess, ip FROM loginlog WHERE admin =? And user = ? And date BETWEEN ? And ? ORDER BY id DESC', [req.session.auth.user, req.body.userbox, req.body.datestart, req.body.datefinish], (err, datefilter) => {
            if (!err) {
              res.json({datefilter: datefilter})
            }
          })
        }
      } 
    })
  }
})
router.post('/home/account/bettotalinfo', (req, res) => {
  if (req.session.auth){
    mysql.getConnection().then((conn) =>{
      if (req.session.auth.role === 'U1') {
        conn.query('CALL sp_bettotalinfo1(?)', [req.session.auth.user], (err, totalinfo) => {
          conn.release()
          if (!err) {
            conn.query('CALL sp_bettotalinfo2(?,?)', [req.session.auth.user, 'Kazandi'], (err, woninfo)=>{
              if (!err) {
                conn.query('CALL sp_bettotalinfo3(?,?)', [req.session.auth.user, 'Kaybetti'], (err, lostinfo)=>{
                  if (!err) {
                    conn.query('CALL sp_bettotalinfo3(?,?)', [req.session.auth.user, 'iptal'], (err, cancelinfo)=>{
                      if (!err) {
                        res.json({totalinfo: totalinfo[0][0], woninfo:woninfo[0][0], lostinfo:lostinfo[0][0], cancelinfo:cancelinfo[0][0]})
                      }
                    })
                  }
                })
              }
            })
          }
        })
      } else {
        if (req.body.userbox === 'Üyeler'){
          conn.query('CALL sp_bettotalinfo4(?)', [req.session.auth.user], (err, totalinfo) => {
            conn.release()
            if (!err) {
              conn.query('CALL sp_bettotalinfo5(?,?)', [req.session.auth.user, 'Kazandi'], (err, woninfo)=>{
                if (!err) {
                  conn.query('CALL sp_bettotalinfo5(?,?)', [req.session.auth.user, 'Kaybetti'], (err, lostinfo)=>{
                    if (!err) {
                      conn.query('CALL sp_bettotalinfo6(?,?)', [req.session.auth.user, 'iptal'], (err, cancelinfo)=>{
                        if (!err) {
                          res.json({totalinfo: totalinfo[0][0], woninfo:woninfo[0][0], lostinfo:lostinfo[0][0], cancelinfo:cancelinfo[0][0]})
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        } else {
          conn.query('CALL sp_bettotalinfo1(?)', [req.body.userbox], (err, totalinfo) => {
            conn.release()
            if (!err) {
              conn.query('CALL sp_bettotalinfo2(?,?)', [req.body.userbox, 'Kazandi'], (err, woninfo)=>{
                if (!err) {
                  conn.query('CALL sp_bettotalinfo3(?,?)', [req.body.userbox, 'Kaybetti'], (err, lostinfo)=>{
                    if (!err) {
                      conn.query('CALL sp_bettotalinfo3(?,?)', [req.body.userbox, 'iptal'], (err, cancelinfo)=>{
                        if (!err) {
                          res.json({totalinfo: totalinfo[0][0], woninfo:woninfo[0][0], lostinfo:lostinfo[0][0], cancelinfo:cancelinfo[0][0]})
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  }
})
router.post('/home/account/betinspect', (req, res) => {
  if (req.session.auth){
    mysql.getConnection().then((conn) =>{
      if (req.session.auth.role === 'U1') {
        conn.query(`SELECT * FROM betshistory WHERE user = ? And ${req.body.column} = ? And state != "Aktif"`,[req.session.auth.user, req.body.value], (err, result)=>{
          conn.release()
          if (!err) {
            res.json({result:result})
          }
        })
      } else {
        if (req.body.userbox === 'Üyeler'){
          conn.query(`SELECT * FROM betshistory WHERE admin = ? And ${req.body.column} = ? And state != "Aktif"`,[req.session.auth.user, req.body.value], (err, result)=>{
            conn.release()
            if (!err) {
              res.json({result:result})
            }
          })
        } else {
          conn.query(`SELECT * FROM betshistory WHERE user = ? And ${req.body.column} = ? And state != "Aktif"`,[req.body.userbox, req.body.value], (err, result)=>{
            if (!err) {
              res.json({result:result})
            }
          })
        }
      }
    })
  }
})
router.post('/home/account/betinspectmatches', (req, res) => {
  if (req.session.auth){
    mysql.getConnection().then((conn) =>{
      if (req.session.auth.role === 'U1') {
        conn.query(`SELECT * FROM betshistory WHERE user = ?  And state != "Aktif" And matches Like "%${req.body.value}%"`,[req.session.auth.user], (err, result)=>{
          conn.release()
          if (!err) {
            res.json({result:result})
          }
        })
      } else {
        if (req.body.userbox === 'Üyeler'){
          conn.query(`SELECT * FROM betshistory WHERE admin = ?  And state != "Aktif" And matches Like "%${req.body.value}%"`,[req.session.auth.user], (err, result)=>{
            conn.release()
            if (!err) {
              res.json({result:result})
            }
          })
        } else {
          conn.query(`SELECT * FROM betshistory WHERE user = ?  And state != "Aktif" And matches Like "%${req.body.value}%"`,[req.body.userbox], (err, result)=>{
            if (!err) {
              res.json({result:result})
            }
          })
        }
      }
    })
  }
})
router.get('/home/account/games', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`SELECT name FROM markets`, (err, result) => {
        conn.release()
        if (!err) {
          res.json({ result: result})
        }
      })
    })
  }
})
router.post('/home/account/options', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
    if (req.session.auth.role === 'U1') {
      conn.query('SELECT options FROM betshistory WHERE user = ? GROUP BY options', [req.session.auth.user], (err, result) => {
        conn.release()
        if (!err) {
          res.json({ result: result})
        }
      })
      } else {
        if (req.body.userbox === 'Üyeler') {
          conn.query('SELECT options FROM betshistory WHERE admin = ? GROUP BY options', [req.session.auth.user], (err, result) => {
            conn.release()
            if (!err) {
              res.json({ result: result})
            }
          })
        } else {
          conn.query('SELECT options FROM betshistory WHERE user = ? GROUP BY options', [req.body.userbox], (err, result) => {
            if (!err) {
              res.json({ result: result})
            }
          })
        }
      }
    })
  }
})
router.get("/chat", (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then(conn => {
      if (req.session.auth) {
        if (req.session.auth.role === "U1") {
          conn.query('SELECT user, (SELECT COUNT(*) FROM messages WHERE sender = users.user and receiver = ? and readed = ?) AS count FROM users WHERE user = ?', [req.session.auth.user, 'no', req.session.auth.admin], (err, chatuser) => {
            conn.release()
            if (!err) {
              res.json({ chatuser: chatuser })
            }
          })
        } else {
          conn.query('SELECT user, admin, (SELECT COUNT(*) FROM messages WHERE sender = users.user and receiver = ? and readed = ?) AS count FROM users WHERE user = ? || admin = ?', [req.session.auth.user, 'no', req.session.auth.admin, req.session.auth.user], (err, chatuser) => {
            conn.release()
            if (!err) {
              res.json({ chatuser: chatuser })
            }
          })
        }
      }
    })
  }
})
router.post("/getmsg", (req, res) => {
  if (req.session.auth) {
    let sender = req.body.sender + "-" + req.body.receiver
    let receiver = req.body.receiver + "-" + req.body.sender
    mysql.getConnection().then(conn => {
      conn.query('SELECT msg, date, sender, receiver, readed FROM messages WHERE BETWEENmsg = "' + sender + '" || BETWEENmsg = "' + receiver + '"', (err, getmsg) => {
        conn.release()
        if (!err) {
          res.json({ getmsg: getmsg })
        }
      })
    })
  }
})
router.post("/deletemsg", (req, res) => {
  if (req.session.auth) {
    let sender = req.body.sender + "-" + req.body.receiver
    let receiver = req.body.receiver + "-" + req.body.sender
    mysql.getConnection().then(conn => {
      conn.query('DELETE FROM messages WHERE BETWEENmsg = "' + sender + '" || BETWEENmsg = "' + receiver + '"', (err) => {
        conn.release()
        if (!err) {
          res.json({ message: "Mesajlar başarıyla silindi" })
        }
      })
    })
  }
})
router.post("/updatemsg", (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then(conn => {
      conn.query('UPDATE messages SET readed = "yes" WHERE sender = ? And receiver = ?', [req.body.sender, req.session.auth.user],()=>{
        conn.release()
      })
    })
  }
})
router.get("/home/msgcount", (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query('SELECT Count(*) As count FROM messages  WHERE receiver = ? And readed = ? GROUP BY receiver', [req.session.auth.user, 'no'], (err, result) => {
        conn.release()
        if (!err) {
          if (result.length > 0) {
            res.json({code: 200, message: result[0].count })
          }
        }
      })
    })
  }
})
router.get("/home/inplay", cacheMiddleware(60),  (req, res) => {
  if (res.status !== 502 || res.status !== 500){
    var result = request('GET', `https://api.betsapi.com/v1/bet365/inplay?token=27960-KN95CHlK6qEasa`,{json: {results: 'results'}})
    res.json(JSON.parse(result.getBody('utf8')))
  }
})
router.get("/home/inplayodds/:id", cacheMiddleware(10),(req, res) => {
  if (res.status !== 502 || res.status !== 500){
    var result = request('GET', `https://api.betsapi.com/v1/bet365/event?token=27960-KN95CHlK6qEasa&FI=${req.params.id}&stats`,{json: {results: 'results'}})
    res.json(JSON.parse(result.getBody('utf8')))
  }
})
router.get("/home/soccer", cacheMiddleware(300), (req, res) => {
  const result = request('GET', `http://api.betsapi.com/v1/bet365/upcoming?sport_id=1&page=1&token=27960-KN95CHlK6qEasa`,{json: {results: 'results'}})
  const b = JSON.parse(result.getBody('utf8'))
  var pagenumber = Math.ceil(b.pager.total/b.pager.per_page)
  if (pagenumber < 1) {
    res.json(b)
  } else {
    const urls = []
    for (var i = 1; i <= pagenumber; i++) {
      urls.push(`http://api.betsapi.com/v1/bet365/upcoming?sport_id=1&page=${i}&token=27960-KN95CHlK6qEasa`)
    }
    fetchData = () => {
      const allRequests = urls.map(async url => {
        return await fetch(url).then(response => response.json())
      })
      return Promise.all(allRequests)
    }
    fetchData().then(arrayOfResponses => 
      fs.writeFile('soccer.json', JSON.stringify(arrayOfResponses, null, 4),(err) => {
        if (!err) {
          res.json({code: 200})
        }
      })
    ).catch(err => console.log(err))
  }
})
router.get("/home/basketball", cacheMiddleware(300), (req, res) => {
  const result = request('GET', `http://api.betsapi.com/v1/bet365/upcoming?sport_id=18&page=1&token=27960-KN95CHlK6qEasa`,{json: {results: 'results'}})
  const b = JSON.parse(result.getBody('utf8'))
  var pagenumber = Math.ceil(b.pager.total/b.pager.per_page)
  if (pagenumber < 1) {
    res.json(b)
  } else {
    const urls = []
    for (var i = 1; i <= pagenumber; i++) {
      urls.push(`http://api.betsapi.com/v1/bet365/upcoming?sport_id=18&page=${i}&token=27960-KN95CHlK6qEasa`)
    }
    fetchData = () => {
      const allRequests = urls.map(async url => {
        return await fetch(url).then(response => response.json())
      })
      return Promise.all(allRequests)
    }
    fetchData().then(arrayOfResponses => 
      fs.writeFile('basket.json', JSON.stringify(arrayOfResponses, null, 4),(err) => {
        if (!err) {
          res.json({code: 200})
        }
      })
    ).catch(err => console.log(err))
  }
})
router.get("/home/prematchodds/:id", cacheMiddleware(300), (req, res) => {
  if (res.status !== 502 || res.status !== 500){
    var result = request('GET', `https://api.betsapi.com/v1/bet365/prematch?token=27960-KN95CHlK6qEasa&FI=${req.params.id}`,{json: {results: 'results'}})
    res.json(JSON.parse(result.getBody('utf8')))
  }
})
router.get("/home/scores", cacheMiddleware(60), (req, res) => {
  let scores = []
  osmosis
  .get('https://www.fotomac.com.tr/canli-skor/')
  .find('.match-list')
  .set({
    flags: 'img@data-src',
    league:'a span',
    time:['tbody .table-time span'],
    ms:['tbody .table-chart'],
    firstteam:['.match-list-team-home span'],
    homescore:['.match-list-score [data-area = "home-score"]'],
    em:['.match-list-score em'],
    awayscore:['.match-list-score [data-area = "away-score"]'],
    secondteam:['.match-list-team-away span'],
    halfscore:['.table-score']
  })
  .data((data)=> {
    scores.push(data)
  })
  .done(()=> {
    fs.writeFile('scores.json', JSON.stringify(scores, null, 4),(err) => {
      if(err) console.error(err)
        else console.log('Data Saved to data.json file')
      })
  })
})
router.get("home/standings/:id",(req, res) => {
  let standings = []
  let url = id
  osmosis
  .get(url)
  .find('.league-score .m-table .m-tr')
  .set({
          teams:'.teams',
          o:'.m-td[5]',
          g:'.m-td[6]',
          b:'.m-td[7]',
          m:'.m-td[8]',
          a:'.m-td[9]',
          y:'.m-td[10]',
          av:'.m-td[11]',
          p:'.m-td[12]'
      }
  )
  .data((data)=> {
      standings.push(data)
  })
  .done(()=> {
    fs.writeFile('standings.json', JSON.stringify(standings, null, 4),(err) => {
      if (!err) {
        console.log('Done...')
      }
    })
  })
})
// router.get('/home/account/insertscores',(req, res) => {
//   let scoreId = ''
//   let score = []
//   mysql.getConnection().then((conn) => {
//     conn.query('SELECT DISTINCT scoreid FROM bets WHERE scoreid != "0"', (err, result) => {
//       conn.release()
//       if (!err) {
//         result.forEach(item => {
//           scoreId += item.scoreid +','
//         })
//         if (scoreId.length > 0) {
//           axios.get(`https://soccer.sportmonks.com/api/v2.0/fixtures/multi/${scoreId}?api_token=jOUYCgbKqgICbGzO0t1Rej6diHKG5OO9Tl054oFLUuuGVIQbKuA3N1LaBPTH`).then((result)=>{
//             result.data.data.forEach(item => {
//               score.push({code:item.id.toString().slice(-3), score:item.scores.ht_score +'/'+ item.scores.ft_score, status: item.time.status, minute: item.time.minute})
//             })
//             const newscore = score
//             const insertscore = []
//             for (const key in newscore) {
//               insertscore.push([
//                 newscore[key].code,
//                 newscore[key].score,
//                 newscore[key].status,
//                 newscore[key].minute
//               ])
//             }
//             if (insertscore.length > 0) {
//               conn.query('DELETE FROM scores',(err)=>{
//                 if (!err) {
//                   conn.query('INSERT INTO scores (code, score, status, minute) VALUES ?', [insertscore], (err) => {
//                     if (!err) {
//                       res.json({code: 200})
//                     }
//                   })
//                 }
//               })
//             }
//           })
//         }
//       }
//     })
//   })
// })
router.post('/home/account/leagues', (req, res) => {
  if (req.session.auth) {
    if (req.body.userbox !=='Üyeler') {
      mysql.getConnection().then((conn) => {
        conn.query(`SELECT id,name, ${req.body.userbox} FROM leagues ORDER BY name`, (err, leagues) => {
          conn.release()
          if (!err) {
            res.json({ leagues: leagues})
          }
        })
      })
    }
  }
})
router.post('/home/account/markets', (req, res) => {
  if (req.session.auth) {
    if (req.body.userbox !=='Üyeler') {
      mysql.getConnection().then((conn) => {
        conn.query(`SELECT id,name, ${req.body.userbox} FROM markets ORDER BY name`, (err, markets) => {
          conn.release()
          if (!err) {
            res.json({ markets: markets})
          }
        })
      })
    }
  }
})
router.post('/home/account/leaguesid', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`SELECT id FROM leagues WHERE ${req.body.userbox} = 0`, (err, leaguesid) => {
        conn.release()
        if (!err) {
          res.json({ leaguesid: leaguesid})
        }
      })
    })
  }
})
router.post('/home/account/marketsname', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`SELECT name FROM markets WHERE ${req.body.userbox} = 0`, (err, marketsname) => {
        conn.release()
        if (!err) {
          res.json({ marketsname: marketsname})
        }
      })
    })
  }
})
router.post('/home/account/updateleagues', (req, res) => {
  if (req.session.auth) {
    if (req.body.userbox !=='Üyeler') {
      mysql.getConnection().then((conn) => {
        conn.query(`UPDATE leagues SET ${req.body.userbox} = ? WHERE id = ?`, [req.body.state, req.body.id], (err, ) => {
          conn.release()
          if (!err) {
            res.json({message: 'done'})
          }
        })
      })
    }
  }
})
router.post('/home/account/updatemarkets', (req, res) => {
  if (req.session.auth) {
    if (req.body.userbox !=='Üyeler') {
      mysql.getConnection().then((conn) => {
        conn.query(`UPDATE markets SET ${req.body.userbox} = ? WHERE id = ?`, [req.body.state, req.body.id], (err, ) => {
          conn.release()
          if (!err) {
            res.json({message: 'done'})
          }
        })
      })
    }
  }
})
router.post('/home/account/rate', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`SELECT rate FROM users WHERE user = ?`, [req.body.userbox], (err, rate) => {
        conn.release()
        if (!err) {
          res.json({ rate: rate})
        }
      })
    })
  }
})
router.post('/home/account/updaterate', (req, res) => {
  if (req.session.auth) {
    if (req.body.userbox !=='Üyeler') {
      mysql.getConnection().then((conn) => {
        conn.query(`UPDATE users SET operate = ?, rate = ? WHERE user = ?`, [req.body.operate, req.body.newrate, req.body.userbox], (err, ) => {
          conn.release()
          if (!err) {
            res.json({message: 'done'})
          }
        })
      })
    }
  }
})

router.post('/home/account/liveleagues', (req, res) => {
  if (req.session.auth) {
    if (req.body.userbox !=='Üyeler') {
      mysql.getConnection().then((conn) => {
        conn.query(`SELECT id,name, ${req.body.userbox} FROM liveleagues ORDER BY name`, (err, liveleagues) => {
          conn.release()
          if (!err) {
            res.json({ liveleagues: liveleagues})
          }
        })
      })
    }
  }
})
router.post('/home/account/liveleaguesname', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`SELECT name FROM liveleagues WHERE ${req.body.userbox} = 0`, (err, liveleaguesname) => {
        conn.release()
        if (!err) {
          res.json({ liveleaguesname: liveleaguesname})
        }
      })
    })
  }
})
router.post('/home/account/livemarkets', (req, res) => {
  if (req.session.auth) {
    if (req.body.userbox !=='Üyeler') {
      mysql.getConnection().then((conn) => {
        conn.query(`SELECT id,name, ${req.body.userbox} FROM livemarkets`, (err, livemarkets) => {
          conn.release()
          if (!err) {
            res.json({ livemarkets: livemarkets})
          }
        })
      })
    }
  }
})
router.post('/home/account/livemarketsid', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`SELECT id FROM livemarkets WHERE ${req.body.userbox} = 0`, (err, livemarketsid) => {
        conn.release()
        if (!err) {
          res.json({ livemarketsid: livemarketsid})
        }
      })
    })
  }
})

router.post('/home/account/updateliveleagues', (req, res) => {
  if (req.session.auth) {
    if (req.body.userbox !=='Üyeler') {
      mysql.getConnection().then((conn) => {
        conn.query(`UPDATE liveleagues SET ${req.body.userbox} = ? WHERE id = ?`, [req.body.state, req.body.id], (err, ) => {
          conn.release()
          if (!err) {
            res.json({message: 'done'})
          }
        })
      })
    }
  }
})
router.post('/home/account/updatelivemarkets', (req, res) => {
  if (req.session.auth) {
    if (req.body.userbox !=='Üyeler') {
      mysql.getConnection().then((conn) => {
        conn.query(`UPDATE livemarkets SET ${req.body.userbox} = ? WHERE id = ?`, [req.body.state, req.body.id], (err, ) => {
          conn.release()
          if (!err) {
            res.json({message: 'done'})
          }
        })
      })
    }
  }
})
router.post('/home/account/liverate', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`SELECT liverate FROM users WHERE user = ?`, [req.body.userbox], (err, liverate) => {
        conn.release()
        if (!err) {
          res.json({ liverate: liverate})
        }
      })
    })
  }
})
router.post('/home/account/updateliverate', (req, res) => {
  if (req.session.auth) {
    if (req.body.userbox !=='Üyeler') {
      mysql.getConnection().then((conn) => {
        conn.query(`UPDATE users SET liveoperate = ?, liverate = ? WHERE user = ?`, [req.body.operate, req.body.newrate, req.body.userbox], (err, ) => {
          conn.release()
          if (!err) {
            res.json({message: 'done'})
          }
        })
      })
    }
  }
})

module.exports = router