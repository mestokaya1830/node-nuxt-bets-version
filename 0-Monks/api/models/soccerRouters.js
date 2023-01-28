const express = require('express')
const router = express.Router()
const mysql = require('./db')

router.get('/leagues/soccer', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`SELECT cn,lid,ln,${req.session.auth.user} FROM soccer  ORDER BY cn`, (err, data) => {
        conn.release()
        if (!err) {
          res.json({ data: data})
        }
      })
    })
  }
})
router.post('/soccerupdate', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`UPDATE soccer SET ${req.session.auth.user} = ? WHERE lid = ?`, [req.body.state, req.body.lid], (err) => {
        conn.release()
        if(!err){
          if (!req.body.state) {
            let newset = {
              user:req.session.auth.user,
              admin:req.session.auth.admin,
              type:'so',
              filterid:req.body.lid
            }
            conn.query('INSERT INTO settings SET ?',[newset], (err)=>{
              if (!err) {
                res.json({message: 'done'})
              }
            })
          } else {
            conn.query('DELETE FROM settings WHERE user = ? AND filterid = ? AND type = "so"',[req.session.auth.user, req.body.lid], (err)=>{
              if (!err) {
                res.json({message: 'done'})
              }
            })
          }
        }
      })
    })
  }
})
router.get('/markets/soccermarkets', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`SELECT mid,mn, ${req.session.auth.user} FROM soccermarkets ORDER BY mn`, (err, data) => {
        conn.release()
        if (!err) {
          res.json({ data: data})
        }
      })
    })
  }
})
router.post('/soccermarketsupdate', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`UPDATE soccermarkets SET ${req.session.auth.user} = ? WHERE mid = ?`, [req.body.state, req.body.mid], (err) => {
        conn.release()
        if(!err){
          if (!req.body.state) {
            let newset = {
              user:req.session.auth.user,
              admin:req.session.auth.admin,
              type:'som',
              filterid:req.body.mid
            }
            conn.query('INSERT INTO settings SET ?',[newset], (err)=>{
              if (!err) {
                res.json({message: 'done'})
              }
            })
          } else {
            conn.query('DELETE FROM settings WHERE user = ? AND filterid = ? AND type = "som"',[req.session.auth.user, req.body.mid], (err)=>{
              if (!err) {
                res.json({message: 'done'})
              }
            })
          }
        }
      })
    })
  }
})
router.get('/leagues/soccerinplay', (req, res) => {
  mysql.getConnection().then((conn) => {
    conn.query(`SELECT cn,lid,ln,${req.session.auth.user} FROM soccerinplay  ORDER BY cn`, (err, data) => {
      conn.release()
      if (!err) {
        res.json({ data: data})
      }
    })
  })
})
router.post('/soccerinplayupdate', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`UPDATE soccerinplay SET ${req.session.auth.user} = ? WHERE lid = ?`, [req.body.state, req.body.lid], (err) => {
        conn.release()
        if(!err){
          if (!req.body.state) {
            let newset = {
              user:req.session.auth.user,
              admin:req.session.auth.admin,
              type:'soi',
              filterid:req.body.lid
            }
            conn.query('INSERT INTO settings SET ?',[newset], (err)=>{
              if (!err) {
                res.json({message: 'done'})
              }
            })
          } else {
            conn.query('DELETE FROM settings WHERE user = ? AND filterid = ? AND type = "soi"',[req.session.auth.user, req.body.lid], (err)=>{
              if (!err) {
                res.json({message: 'done'})
              }
            })
          }
        }
      })
    })
  }
})
router.get('/markets/soccerinplaymarkets', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`SELECT mid,mn, ${req.session.auth.user} FROM soccerinplaymarkets ORDER BY mn`, (err, data) => {
        conn.release()
        if (!err) {
          res.json({ data: data})
        }
      })
    })
  }
})
router.post('/soccerinplaymarketsupdate', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      conn.query(`UPDATE soccerinplaymarkets SET ${req.session.auth.user} = ? WHERE mid = ?`, [req.body.state, req.body.mid], (err) => {
        conn.release()
        if(!err){
          if (!req.body.state) {
            let newset = {
              user:req.session.auth.user,
              admin:req.session.auth.admin,
              type:'soim',
              filterid:req.body.mid
            }
            conn.query('INSERT INTO settings SET ?',[newset], (err)=>{
              if (!err) {
                res.json({message: 'done'})
              }
            })
          } else {
            conn.query('DELETE FROM settings WHERE user = ? AND filterid = ? AND type = "soim"',[req.session.auth.user, req.body.mid], (err)=>{
              if (!err) {
                res.json({message: 'done'})
              }
            })
          }
        }
      })
    })
  }
})
router.post('/soccerupdaterate', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      if (req.body.operate !== 'Orjinal') {
        let newset = {
          user:req.session.auth.user,
          admin:req.session.auth.admin,
          operate:req.body.operate,
          type:'sor',
          filterid:0,
          rate:req.body.newrate
        }
        conn.query('SELECT user, type FROM settings WHERE user = ? AND type = "sor" Limit 1',[req.session.auth.user],(err, result) =>{
          conn.release()
          if (!err && result.length > 0) {
            conn.query('DELETE FROM settings WHERE user = ? AND type = "sor"',[req.session.auth.user],(err) =>{
              if (!err) {
                conn.query('INSERT INTO settings SET ?',[newset], (err)=>{
                  if (!err) {
                    res.json({message: 'done'})
                  }
                })
              }
            })
          }else{
            conn.query('INSERT INTO settings SET ?',[newset], (err)=>{
              if (!err) {
                res.json({message: 'done'})
              }
            })
          }
        })
      } else {
        conn.query('DELETE FROM settings WHERE user = ? AND type = "sor"',[req.session.auth.user, req.body.mid], (err)=>{
          conn.release()
          if (!err) {
            res.json({message: 'done'})
          }
        })
      }
    })
  }
})
router.post('/soccerupdateliverate', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      if (req.body.operate !== 'Orjinal') {
        let newset = {
          user:req.session.auth.user,
          admin:req.session.auth.admin,
          operate:req.body.operate,
          type:'solr',
          filterid:0,
          rate:req.body.newrate
        }
        conn.query('SELECT user, type FROM settings WHERE user = ? AND type = "solr" Limit 1',[req.session.auth.user],(err, result) =>{
          conn.release()
          if (!err && result.length > 0) {
            conn.query('DELETE FROM settings WHERE user = ? AND type = "solr"',[req.session.auth.user],(err) =>{
              if (!err) {
                conn.query('INSERT INTO settings SET ?',[newset], (err)=>{
                  if (!err) {
                    res.json({message: 'done'})
                  }
                })
              }
            })
          }else{
            conn.query('INSERT INTO settings SET ?',[newset], (err)=>{
              if (!err) {
                res.json({message: 'done'})
              }
            })
          }
        })
      } else {
        conn.query('DELETE FROM settings WHERE user = ? AND type = "solr"',[req.session.auth.user, req.body.mid], (err)=>{
          conn.release()
          if (!err) {
            res.json({message: 'done'})
          }
        })
      }
    })
  }
})
router.post('/soccerupdateratelimit', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      if (req.body.operate !== 'reset') {
        let newset = {
          user:req.session.auth.user,
          admin:req.session.auth.admin,
          operate:req.body.operate,
          type:'sol',
          filterid:0,
          rate:req.body.ratelimit
        }
        conn.query('SELECT user, type FROM settings WHERE user = ? AND type = "sol" Limit 1',[req.session.auth.user],(err, result) =>{
          conn.release()
          if (!err && result.length > 0) {
            conn.query('DELETE FROM settings WHERE user = ? AND type = "sol"',[req.session.auth.user],(err) =>{
              if (!err) {
                conn.query('INSERT INTO settings SET ?',[newset], (err)=>{
                  if (!err) {
                    res.json({message: 'done'})
                  }
                })
              }
            })
          }else{
            conn.query('INSERT INTO settings SET ?',[newset], (err)=>{
              if (!err) {
                res.json({message: 'done'})
              }
            })
          }
        })
      } else {
        conn.query('DELETE FROM settings WHERE user = ? AND type = "sol"',[req.session.auth.user, req.body.mid], (err)=>{
          conn.release()
          if (!err) {
            res.json({message: 'done'})
          }
        })
      }
    })
  }
})
router.post('/soccerupdateliveratelimit', (req, res) => {
  if (req.session.auth) {
    mysql.getConnection().then((conn) => {
      if (req.body.operate !== 'reset') {
        let newset = {
          user:req.session.auth.user,
          admin:req.session.auth.admin,
          operate:req.body.operate,
          type:'soll',
          filterid:0,
          rate:req.body.ratelimit
        }
        conn.query('SELECT user, type FROM settings WHERE user = ? AND type = "soll" Limit 1',[req.session.auth.user],(err, result) =>{
          conn.release()
          if (!err && result.length > 0) {
            conn.query('DELETE FROM settings WHERE user = ? AND type = "soll"',[req.session.auth.user],(err) =>{
              if (!err) {
                conn.query('INSERT INTO settings SET ?',[newset], (err)=>{
                  if (!err) {
                    res.json({message: 'done'})
                  }
                })
              }
            })
          }else{
            conn.query('INSERT INTO settings SET ?',[newset], (err)=>{
              if (!err) {
                res.json({message: 'done'})
              }
            })
          }
        })
      } else {
        conn.query('DELETE FROM settings WHERE user = ? AND type = "soll"',[req.session.auth.user, req.body.mid], (err)=>{
          conn.release()
          if (!err) {
            res.json({message: 'done'})
          }
        })
      }
    })
  }
})

module.exports = router