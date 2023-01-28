const express = require('express')
const router = express.Router()
const mysql = require('./db')
const Cryptr = require('cryptr')
const cryptr = new Cryptr('myTotalySecretKey')
const wrapAsync = require('../../middleware/wrapasync')

router.post('/register', wrapAsync(async (req, res) => {
  let SETRole = null
  if (req.body.role === 'B1') {
    SETRole = 'S1'
  } else if (req.body.role === 'S1') {
    SETRole = 'A1'
  } else if (req.body.role === 'A1') {
    if (req.body.customer) {
      SETRole = 'G1'
    } else {
      SETRole = 'U1'
    }
  }else{
    SETRole = 'C1'
  }
  const conn = await mysql.getConnection()
  conn.release()
  const result = await conn.query('SELECT admin, userlimit, usedlimit FROM users WHERE user = ? LIMIT 1', [req.session.auth.user])
    if (result[0][0].usedlimit >= result[0][0].userlimit) {
      res.json({code: 400, message: 'Limitiniz dolmuştur!'})
    } else {
      const users = await conn.query('SELECT user, nick FROM users WHERE user = ? || nick = ?  LIMIT 1', [req.body.user, req.body.nick])
      if (users[0].length > 0) {
        if (users[0][0].user === req.body.user) {
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
          superadmin: result[0][0].admin,
          credit: req.body.credit,
          creditremain: req.body.credit,
          userlimit: req.body.userlimit,
          usedlimit: req.body.usedlimit,
          role: SETRole,
          payment: new Date()
        }
        var creditlog = {
          user: req.body.user,
          admin: req.body.admin,
          superadmin: result[0][0].admin,
          date: new Date(),
          amount: req.body.credit,
          credit: req.body.credit,
          creditremain: req.body.credit,
          ope: 'Limit',
          des: 'Yeni Kayıt'
        }
        if (req.body.role === 'S1'){
          await conn.query('INSERT INTO users SET ?', [newUser])
          await conn.query('UPDATE users SET usedlimit = usedlimit + 1 WHERE user = ?', [req.session.auth.user])
          await conn.query('INSERT INTO settime SET user = ?, admin = ?', [req.body.user, req.session.auth.user])
          await conn.query('INSERT INTO setlimit SET user = ?, admin = ?', [req.body.user, req.session.auth.user])
          await conn.query('ALTER TABLE branch ADD '+ req.body.user +' BOOLEAN DEFAULT true')
          await conn.query('ALTER TABLE basket ADD '+ req.body.user +' BOOLEAN DEFAULT true')
          await conn.query('ALTER TABLE basketinplay ADD '+ req.body.user +' BOOLEAN DEFAULT true')
          await conn.query('ALTER TABLE basketmarkets ADD '+ req.body.user +' BOOLEAN DEFAULT true')
          await conn.query('ALTER TABLE basketinplaymarkets ADD '+ req.body.user +' BOOLEAN DEFAULT true')
          await conn.query('ALTER TABLE soccer ADD '+ req.body.user +' BOOLEAN DEFAULT true')
          await conn.query('ALTER TABLE soccermarkets ADD '+ req.body.user +' BOOLEAN DEFAULT true')
          await conn.query('ALTER TABLE soccerinplay ADD '+ req.body.user +' BOOLEAN DEFAULT true')
          await conn.query('ALTER TABLE soccerinplaymarkets ADD '+ req.body.user +' BOOLEAN DEFAULT true')
          res.json({code: 200, message: 'Yeni kullanici eklendi'})
        }else if(req.body.role === 'B1'){
          await conn.query('INSERT INTO users SET ?', [newUser])
          await conn.query('UPDATE users SET usedlimit = usedlimit + 1 WHERE user = ?', [req.session.auth.user])
          res.json({code: 200, message: 'Yeni kullanici eklendi'})
        }else if(req.body.role === 'G1'){
          if (newUser.credit > req.session.auth.creditremain) {
            res.json({message: 'Kredi Miktarı Çok Fazla!'})
          } else {
            await conn.query('INSERT INTO users SET ?', [newUser])
            await conn.query('INSERT INTO creditlog SET ?', [creditlog])
            await conn.query('UPDATE users SET usedlimit = usedlimit + 1 WHERE user = ?', [req.session.auth.user])
            await conn.query('UPDATE users SET creditremain = creditremain - "'+newUser.credit+'" WHERE user = ?', [req.session.auth.user])
            res.json({code: 200, message: 'Yeni kullanici eklendi'})
          }
        }else{
          await conn.query('INSERT INTO users SET ?', [newUser])
          await conn.query('INSERT INTO creditlog SET ?', [creditlog])
          await conn.query('UPDATE users SET usedlimit = usedlimit + 1 WHERE user = ?', [req.session.auth.user])
          res.json({code: 200, message: 'Yeni kullanici eklendi'})
        }
      }
    }
}))
router.get('/userlist', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'G1') {
    const userlist = await conn.query('SELECT user FROM users WHERE user = ? || admin = ?', [req.session.auth.user, req.session.auth.user])
    res.json({ userlist: userlist[0] })
  }else{
    const userlist = await conn.query('SELECT user FROM users WHERE admin = ?', [req.session.auth.user])
    res.json({ userlist: userlist[0] })
  }
}))
router.get('/userlistgamelog', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'G1') {
    const userlist = await conn.query('SELECT user FROM users WHERE user = ? || admin = ?', [req.session.auth.user, req.session.auth.user])
    res.json({ userlist: userlist[0] })
  }else{
    const userlist = await conn.query('SELECT user FROM users WHERE admin = ? || superadmin = ?', [req.session.auth.user, req.session.auth.user])
    res.json({ userlist: userlist[0] })
  }
}))
router.get('/userlistupdatecredit', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const userlist = await conn.query('SELECT user FROM users WHERE admin = ?', [req.session.auth.user])
  res.json({ userlist: userlist[0] })
}))
router.get('/userlistresetaccount', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'G1'){
    const userlist = await conn.query('SELECT user, role FROM users WHERE user = ? || admin = ?', [req.session.auth.user,req.session.auth.user])
    res.json({ userlist: userlist[0] })
  }else{
    const userlist = await conn.query('SELECT user, role FROM users WHERE admin = ?', [req.session.auth.user])
    res.json({ userlist: userlist[0] })
  }
}))
router.get('/userlistcomission', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const userlist = await conn.query('SELECT user FROM users WHERE admin = ? AND role = ?', [req.session.auth.user, 'C1'])
  res.json({ userlist: userlist[0] })
}))
router.get('/users', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const data = await conn.query(' SELECT user, role, admin, credit, creditremain, state, userlimit, usedlimit, payment, autopay FROM users WHERE admin = ? ORDER BY user', [req.session.auth.user])
  res.json({ data: data[0]})
}))
router.get('/users/:id', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const users = await conn.query('SELECT * FROM users WHERE user = ? LIMIT 1', [req.params.id])
  res.json({ users: users[0][0]})
}))
router.get("/activeusers", wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const result = await conn.query('SELECT Count(*) As count FROM users  WHERE admin = ? AND logincheck = ? LIMIT 1', [req.session.auth.user, 'active'])
  res.json({code: 200, activeusers: result[0][0].count })
}))
router.get('/usersset', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const result = await conn.query('SELECT user, role, admin, state, usercomission, personcomission, logincount, logincheck, autopay, usercancelbet, personcancelbet FROM users WHERE user = ?', [req.session.auth.user])
  res.json({ users: result[0] })
}))
router.get('/profile', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const profile = await conn.query('SELECT user, nick, role, credit, creditremain, date, payment, userlimit, usedlimit, state FROM users WHERE user = ? LIMIT 1', [req.session.auth.user])
  res.json({profile: profile[0][0]})
}))
router.delete('/usersdelete/:id', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    if (req.session.auth.role === 'G1') {
      await conn.query('UPDATE users SET usedlimit = usedlimit - 1 WHERE user = ?', [req.session.auth.user])
      await conn.query('DELETE FROM creditlog WHERE user =?', [req.params.id])    
      await conn.query('DELETE FROM gamelog WHERE user =?', [req.params.id])    
      await conn.query('DELETE FROM loginlog WHERE user = ?', [req.params.id]) 
      await conn.query('DELETE FROM bets WHERE user =?', [req.params.id])
      await conn.query('DELETE FROM betshistory WHERE user =?', [req.params.id])
      await conn.query('DELETE FROM betsummary WHERE user =?', [req.params.id])
      await conn.query('DELETE FROM betsummaryhistory WHERE user =?', [req.params.id])
      await conn.query('DELETE FROM users  WHERE user =?', [req.params.id])
      res.json({code: 200, message: 'Kullanıcı başarıyla silindi' })
    }else if (req.session.auth.role === 'A1') {
      await conn.query('UPDATE users SET usedlimit = usedlimit - 1 WHERE user = ?', [req.session.auth.user])
      await conn.query('DELETE FROM creditlog WHERE user = ? || admin = ?', [req.params.id, req.params.id])    
      await conn.query('DELETE FROM gamelog WHERE user = ? || admin = ?', [req.params.id, req.params.id])    
      await conn.query('DELETE FROM loginlog WHERE user = ? || admin = ?', [req.params.id, req.params.id])    
      await conn.query('DELETE FROM bets WHERE user = ? || admin = ?', [req.params.id, req.params.id])    
      await conn.query('DELETE FROM betshistory WHERE user = ? || admin = ?', [req.params.id, req.params.id])    
      await conn.query('DELETE FROM betsummary WHERE user = ? || admin = ?', [req.params.id, req.params.id])    
      await conn.query('DELETE FROM betsummaryhistory WHERE user = ? || admin = ?', [req.params.id, req.params.id])    
      await conn.query('DELETE FROM users WHERE user = ? || admin = ?', [req.params.id, req.params.id])    
      res.json({code: 200, message: 'Kullanıcı başarıyla silindi' })
    }else if (req.session.auth.role === 'S1') {
      await conn.query('UPDATE users SET usedlimit = usedlimit - 1 WHERE user = ?', [req.session.auth.user])
      await conn.query('DELETE FROM setlimit WHERE user = ?', [req.params.id])
      await conn.query('DELETE FROM settime WHERE user = ?', [req.params.id])
      await conn.query('DELETE FROM settings WHERE user = ?', [req.params.id])
      await conn.query('DELETE FROM loginlog WHERE user = ?', [req.params.id])
      await conn.query('DELETE FROM creditlog WHERE admin = ? || superadmin = ?', [req.params.id, req.params.id])
      await conn.query('DELETE FROM gamelog WHERE admin = ? || superadmin = ?', [req.params.id, req.params.id])
      await conn.query('DELETE FROM loginlog WHERE admin = ? || superadmin = ?', [req.params.id, req.params.id])
      await conn.query('DELETE FROM bets WHERE admin = ? || superadmin = ?', [req.params.id, req.params.id])
      await conn.query('DELETE FROM betshistory WHERE admin = ? || superadmin = ?', [req.params.id, req.params.id])
      await conn.query('DELETE FROM betsummary WHERE admin = ? || superadmin = ?', [req.params.id, req.params.id])
      await conn.query('DELETE FROM betsummaryhistory WHERE admin = ? || superadmin = ?', [req.params.id, req.params.id])
      await conn.query(`ALTER TABLE branch DROP COLUMN ${req.params.id}`)
      await conn.query(`ALTER TABLE basket DROP COLUMN ${req.params.id}`)
      await conn.query(`ALTER TABLE basketinplay DROP COLUMN ${req.params.id}`)
      await conn.query(`ALTER TABLE basketmarkets DROP COLUMN ${req.params.id}`)
      await conn.query(`ALTER TABLE basketinplaymarkets DROP COLUMN ${req.params.id}`)
      await conn.query(`ALTER TABLE soccer DROP COLUMN ${req.params.id}`)
      await conn.query(`ALTER TABLE soccermarkets DROP COLUMN ${req.params.id}`)
      await conn.query(`ALTER TABLE soccerinplay DROP COLUMN ${req.params.id}`)
      await conn.query(`ALTER TABLE soccerinplaymarkets DROP COLUMN ${req.params.id}`)
      await conn.query('DELETE FROM users WHERE user = ?', [req.params.id])
      await conn.query('DELETE FROM users WHERE admin = ? || superadmin = ?', [req.params.id, req.params.id])
      res.json({code: 200, message: 'Kullanıcı başarıyla silindi' })
    }else if (req.session.auth.role === 'B1') {
      await conn.query('UPDATE users SET usedlimit = usedlimit - 1 WHERE user = ?', [req.session.auth.user])
      const result = await conn.query('SELECT user FROM users WHERE admin =?', [req.params.id])
      if (result[0].length > 0) {
        await conn.query('DELETE FROM setlimit WHERE admin = ?', [req.params.id])
        await conn.query('DELETE FROM settime WHERE admin = ?', [req.params.id])
        await conn.query('DELETE FROM creditlog WHERE superadmin = ?', [req.params.id])
        await conn.query('DELETE FROM gamelog WHERE superadmin = ?', [req.params.id])
        await conn.query('DELETE FROM loginlog WHERE superadmin = ?', [req.params.id])
        await conn.query('DELETE FROM loginlog WHERE admin = ?', [req.params.id])
        await conn.query('DELETE FROM loginlog WHERE user = ?', [req.params.id])
        await conn.query('DELETE FROM bets WHERE superadmin = ?', [req.params.id])
        await conn.query('DELETE FROM betshistory WHERE superadmin = ?', [req.params.id])
        await conn.query('DELETE FROM betsummary WHERE superadmin = ?', [req.params.id])
        await conn.query('DELETE FROM betsummaryhistory WHERE superadmin = ?', [req.params.id])
        let newArray = []
        result[0].forEach(item => {
          newArray.push('DROP COLUMN '+ item.user)
        })
        await conn.query(`ALTER TABLE branch ${newArray}`)
        await conn.query(`ALTER TABLE basket ${newArray}`)
        await conn.query(`ALTER TABLE basketmarkets ${newArray}`)
        await conn.query(`ALTER TABLE basketinplay ${newArray}`)
        await conn.query(`ALTER TABLE basketinplaymarkets ${newArray}`)
        await conn.query(`ALTER TABLE soccer ${newArray}`)
        await conn.query(`ALTER TABLE soccermarkets ${newArray}`)
        await conn.query(`ALTER TABLE soccerinplay ${newArray}`)
        await conn.query(`ALTER TABLE soccerinplaymarkets ${newArray}`)
        await conn.query('DELETE FROM users WHERE superadmin = ?', [req.params.id])
        await conn.query('DELETE FROM settings WHERE admin = ?', [req.params.id])
        await conn.query('DELETE FROM users WHERE admin = ?', [req.params.id])
        await conn.query('DELETE FROM users WHERE user = ?', [req.params.id])
        res.json({ message: 'Kullanıcı başarıyla silindi' })
      }else{
        await conn.query('DELETE FROM loginlog WHERE user = ?', [req.params.id])
        await conn.query('DELETE FROM users WHERE user = ?', [req.params.id])
        res.json({code: 200, message: 'Kullanıcı başarıyla silindi' })
      }
    }else{
      return false
    }
}))
router.post('/resetaccount', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const activecount = await conn.query('SELECT COUNT(id) AS count FROM betsummary WHERE user = ? And state = ?', [req.body.userbox, 'Aktif'])
  if (activecount[0][0].count === 0) {
    await conn.query('INSERT INTO betsummaryhistory SELECT id, user, admin, superadmin, date, betscount, betscountremain, amount, rate, earn, baseearn, owner, state, userpay, adminpay, stream, role, woncount, lostcount FROM betsummary WHERE user = ? || admin = ?',[req.body.userbox, req.body.userbox])
    await conn.query('INSERT INTO betshistory SELECT betid,code,user,admin,superadmin,matches,games,options,rate,state,stream,date,scoreid,eventtime, score FROM bets WHERE user = ? || admin = ?',[req.body.userbox, req.body.userbox])
    await conn.query('DELETE FROM betsummary WHERE user = ? || admin = ?',[req.body.userbox, req.body.userbox])
    await conn.query('DELETE FROM bets WHERE user = ? || admin = ?',[req.body.userbox, req.body.userbox])
    await conn.query('UPDATE users SET resetaccount = ? WHERE user = ?',[new Date(), req.body.userbox])
    if (req.session.auth.role === 'A1') {
      await conn.query('UPDATE users SET creditremain = credit WHERE user =?', [req.body.userbox])
    }
    res.json({code: 200, message: 'Hesap sıfırlandı'})                        
  } else {
    res.json({ message: 'Aktif kuponunuz var!' })
  }
}))
router.put('/usercomission', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'U1' || req.session.auth.role === 'G1') {
    const usercomission = await conn.query('SELECT usercomission FROM users WHERE user = ? LIMIT 1', [req.session.auth.user])
    res.json({ usercomission: usercomission[0][0].usercomission })
  }else{
    const usercomission = await conn.query('SELECT usercomission FROM users WHERE user = ? LIMIT 1', [req.body.userbox])
    res.json({ usercomission: usercomission[0][0].usercomission })
  }
}))
router.put('/updateusercomission', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.body.userbox === 'Üyeler') {
    await conn.query('UPDATE users SET usercomission = ? WHERE user = ?', [req.body.usercomission, req.session.auth.user])
    await conn.query('UPDATE users SET usercomission = ? WHERE admin = ? AND role = ?', [req.body.usercomission, req.session.auth.user, 'U1'])
    res.json({ code: 200 })
  } else {
    await conn.query('UPDATE users SET usercomission = ? WHERE user = ?', [req.body.usercomission, req.body.user])
    res.json({ code: 200 })
  }
}))
router.put('/updatepersoncomission', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.body.userbox === 'Üyeler') {
    await conn.query('UPDATE users SET personcomission = ? WHERE user = ?', [req.body.personcomission, req.session.auth.user])
    await conn.query('UPDATE users SET personcomission = ? WHERE admin = ? AND role = ?', [req.body.personcomission, req.session.auth.user, 'C1'])
    res.json({ code: 200 })
  } else {
    await conn.query('UPDATE users SET personcomission = ? WHERE user = ?', [req.body.personcomission, req.body.user])
    res.json({ code: 200 })
  }
}))
router.put('/updateusercancelbet', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.body.userbox === 'Üyeler') {
    await conn.query('UPDATE users SET usercancelbet = ? WHERE user = ?', [req.body.usercancelbet, req.session.auth.user])
    await conn.query('UPDATE users SET usercancelbet = ? WHERE admin = ? AND role = ?', [req.body.usercancelbet, req.session.auth.user, 'U1'])
    res.json({ code: 200 })
  } else {
    await conn.query('UPDATE users SET usercancelbet = ? WHERE user = ?', [req.body.usercancelbet, req.body.user])
    res.json({ code: 200 })
  }
}))
router.put('/updatepersoncancelbet', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.body.userbox === 'Üyeler') {
    await conn.query('UPDATE users SET personcancelbet = ? WHERE user = ?', [req.body.personcancelbet, req.session.auth.user])
    await conn.query('UPDATE users SET personcancelbet = ? WHERE admin = ? AND role = ?', [req.body.personcancelbet, req.session.auth.user, 'C1'])
    res.json({ code: 200 })
  } else {
    await conn.query('UPDATE users SET personcancelbet = ? WHERE user = ?', [req.body.personcancelbet, req.body.user])
    res.json({ code: 200 })
  }
}))
router.put('/updatecredit/:id', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  let ope = null
  if (req.body.operate === 'arti') {
    await conn.query('UPDATE users SET credit = credit + ?, creditremain = creditremain + ? WHERE user = ?', [req.body.updateamount, req.body.updateamount, req.params.id])
    ope = 'Eklendi'
  }else{
    ope = 'Eksildi'
    await conn.query('UPDATE users SET credit = credit - ?, creditremain = creditremain - ? WHERE user = ?', [req.body.updateamount, req.body.updateamount, req.params.id])
  }
    const result = await conn.query('SELECT credit, creditremain FROM users WHERE user = ? LIMIT 1', [req.params.id])
    let creditlog = {
      user: req.params.id,
      admin: req.session.auth.user,
      superadmin: req.session.auth.admin,
      date: new Date(),
      amount: req.body.updateamount,
      credit: result[0][0].credit,
      creditremain: result[0][0].creditremain,
      ope: ope,
      des: 'Limit Güncelleme'
    }
    await conn.query('INSERT INTO creditlog SET ?', [creditlog])
    res.json({code: 200})
}))
router.put('/updatecreditremain/:id', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  let ope = null
  if (req.session.auth.role === 'G1') {
    if (req.body.operate === 'arti') {
      await conn.query('UPDATE users SET creditremain = creditremain + ? WHERE user = ?', [req.body.updateamount, req.params.id])
      await conn.query('UPDATE users SET creditremain = creditremain - ? WHERE user = ?', [req.body.updateamount, req.session.auth.user])
      ope = 'Eklendi'
    }else{
      ope = 'Eksildi'
      await conn.query('UPDATE users SET creditremain = creditremain - ? WHERE user = ?', [ req.body.updateamount, req.params.id])
      await conn.query('UPDATE users SET creditremain = creditremain + ? WHERE user = ?', [ req.body.updateamount, req.session.auth.user])
    }
  } else {
    if (req.body.operate === 'arti') {
      await conn.query('UPDATE users SET creditremain = creditremain + ? WHERE user = ?', [req.body.updateamount, req.params.id])
      ope = 'Eklendi'
    }else{
      ope = 'Eksildi'
      await conn.query('UPDATE users SET creditremain = creditremain - ? WHERE user = ?', [ req.body.updateamount, req.params.id])
    }
  }
    const result = await conn.query('SELECT credit, creditremain FROM users WHERE user = ? LIMIT 1', [req.params.id])
    let creditlog = {
      user: req.params.id,
      admin: req.session.auth.user,
      superadmin: req.session.auth.admin,
      date: new Date(),
      amount: req.body.updateamount,
      credit: req.body.creditremain,
      creditremain: result[0][0].creditremain,
      ope: ope,
      des: 'Bakiye Güncelleme'
    }
    await conn.query('INSERT INTO creditlog SET ?', [creditlog])
    res.json({code: 200})
}))
router.put('/updatestate/:id', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    if (req.session.auth.role === 'A1') {
      await conn.query('UPDATE users SET state = ? WHERE user = ?', [req.body.state, req.params.id])
      res.json({code: 200})
    }else if(req.session.auth.role === 'S1'){
      await conn.query('UPDATE users SET state = ? WHERE admin = ?', [req.body.state, req.params.id])
      await conn.query('UPDATE users SET state = ? WHERE user = ?', [req.body.state, req.params.id])
      res.json({code: 200})
    }else{
      await conn.query('UPDATE users SET state = ? WHERE superadmin = ?', [req.body.state, req.params.id])
      await conn.query('UPDATE users SET state = ? WHERE admin = ?', [req.body.state, req.params.id])
      await conn.query('UPDATE users SET state = ? WHERE user = ?', [req.body.state, req.params.id])
      res.json({code: 200})
    }
}))
router.put('/updateuserlimit/:id', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  await conn.query('UPDATE users SET userlimit = ? WHERE user = ?', [req.body.newlimit, req.params.id])
  res.json({code: 200})
}))
router.put('/updatepayment/:id', wrapAsync(async (req, res) => {
  let currentDate = new Date()
  const conn = await mysql.getConnection()
  conn.release()
  await conn.query('UPDATE users SET payment = ? WHERE user = ?', [currentDate, req.params.id])
  res.json({code: 200})
}))
router.put('/updateprofile', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const result = await conn.query('SELECT nick FROM users WHERE nick = ?', [req.body.nick])
  if (result[0].length > 0) {
    res.json({ message: 'Bu nick kullanılmaktadır' })
  }else{
    await conn.query('UPDATE users SET nick = ? WHERE user = ?', [req.body.nick, req.session.auth.user])
    res.json({code: 200})
  }
}))
router.put('/updateautopay', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  await conn.query('UPDATE users SET autopay = ? WHERE user = ?', [req.body.autopay, req.session.auth.user])
  res.json({code: 200})
}))
router.put('/updatelogincount', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  console.log(req.body.logincount)
  await conn.query('UPDATE users SET logincount = ? WHERE admin = ? || user = ?', [req.body.logincount, req.session.auth.user, req.session.auth.user])
  res.json({code: 200})
}))
router.post('/creditinfo', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    if (req.session.auth.role === 'G1' || req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
      const creditinfo = await conn.query('SELECT credit, creditremain FROM users WHERE user = ?', [req.session.auth.user])
      res.json({ creditinfo: creditinfo[0][0]})
    } else {
      if (req.body.userbox === 'Üyeler') {
        const creditinfo = await conn.query('SELECT SUM(creditremain) AS creditremainsum, SUM(credit) AS creditsum FROM users WHERE admin = ?', [req.session.auth.user])
        res.json({ creditinfo: creditinfo[0][0]})
      } else {
        const creditinfo = await conn.query('SELECT credit, creditremain FROM users WHERE user = ?', [req.body.userbox])
        res.json({ creditinfo: creditinfo[0][0]})
      }
    }
}))
router.post('/creditinforeset', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'U1') {
    const creditinfo = await conn.query('SELECT credit, creditremain FROM users WHERE user = ?', [req.session.auth.user])
    res.json({ creditinfo: creditinfo[0][0]})
  }else{
    const creditinfo = await conn.query('SELECT credit, creditremain FROM users WHERE user = ?', [req.body.userbox])
    res.json({ creditinfo: creditinfo[0][0]})
  }
}))
router.post('/creditlog', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    if (req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
      const creditlog = await conn.query('SELECT id, user, admin, date, amount, credit, creditremain, ope, des FROM creditlog WHERE user = ? ORDER BY id DESC LIMIT 50', [req.session.auth.user])
      res.json({ creditlog: creditlog[0]})
    } else {
      const creditlog = await conn.query('SELECT id, user, admin, date, amount, credit, creditremain, ope, des FROM creditlog WHERE user = ? ORDER BY id DESC LIMIT 50', [req.body.userbox])
      res.json({ creditlog: creditlog[0]})
    }
}))
router.post('/creditlogall', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
    const creditlog = await conn.query('SELECT id, user, admin, date, amount, credit, creditremain, ope, des FROM creditlog WHERE user = ? And id < ? ORDER BY id DESC LIMIT 50', [req.session.auth.user, req.body.lastid])
    res.json({ creditlog: creditlog[0]})
  } else {
    const creditlog = await conn.query('SELECT id, user, admin, date, amount, credit, creditremain, ope, des FROM creditlog WHERE user = ?  And id < ? ORDER BY id DESC LIMIT 50', [req.body.userbox, req.body.lastid])
    res.json({ creditlog: creditlog[0]})
  }
}))
router.post('/creditlog/datefilter', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    if (req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
      const datefilter = await conn.query('SELECT user, admin, date, amount, credit, creditremain, ope, des FROM creditlog WHERE user = ? And date BETWEEN ? And ? ORDER BY id DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish])
      res.json({datefilter: datefilter[0]})
    }else {
      const datefilter = await conn.query('SELECT user, admin, date, amount, credit, creditremain, ope, des FROM creditlog WHERE user = ? And date BETWEEN ? And ? ORDER BY id DESC',[req.body.userbox, req.body.datestart, req.body.datefinish])
      res.json({ datefilter: datefilter[0] })
    }
}))
router.post('/loginlog', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    if (req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
      const loginlog = await conn.query('SELECT id, user, admin, date, proccess, ip FROM loginlog WHERE user = ? ORDER BY id DESC LIMIT 50', [req.session.auth.user])
      res.json({ loginlog: loginlog[0]})
    } else {
      const loginlog = await conn.query('SELECT id, user, admin, date, proccess, ip FROM loginlog WHERE user = ? || admin = ? ORDER BY id DESC LIMIT 50', [req.body.userbox, req.body.userbox])
      res.json({ loginlog: loginlog[0]})
    }
}))
router.post('/loginlogall', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
    const loginlog = await conn.query('SELECT id, user, admin, date, proccess, ip FROM loginlog WHERE user =? And id < ? ORDER BY id DESC LIMIT 50', [req.session.auth.user, req.body.lastid])
    res.json({ loginlog: loginlog[0]})
    } else {
      const loginlog = await conn.query('SELECT id, user, admin, date, proccess, ip FROM loginlog WHERE user = ? And id < ? || admin = ? And id < ?  ORDER BY id DESC LIMIT 50', [req.body.userbox, req.body.lastid, req.body.userbox, req.body.lastid])
      res.json({ loginlog: loginlog[0]})
    }
}))
router.post('/loginlog/datefilter', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    if (req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
     const datefilter = await  conn.query('SELECT user, admin, date, proccess, ip FROM loginlog WHERE user =? And date BETWEEN ? And ? ORDER BY id DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish])
      res.json({datefilter: datefilter[0]})
    } else {
      const datefilter = await  conn.query('SELECT user, admin, date, proccess, ip FROM loginlog WHERE admin =? And user = ? And date BETWEEN ? And ? ORDER BY id DESC', [req.session.auth.user, req.body.userbox, req.body.datestart, req.body.datefinish])
      res.json({datefilter: datefilter[0]})
    } 
}))
module.exports = router