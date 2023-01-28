const express = require('express')
const router = express.Router()
const Cryptr = require('cryptr')
const mysql = require('./db')
const cryptr = new Cryptr('myTotalySecretKey')
const moment = require('moment-timezone')
const wrapAsync = require('../../middleware/wrapasync')
let ipAddr = ''
let role = ''

router.post('/login', wrapAsync(async (req, res) => {     
  let user = req.body.user
  if (user) {
    const conn = await mysql.getConnection()
    conn.release()
    const result = await conn.query('SELECT * FROM users WHERE user = ? LIMIT 1', [user])
    if (result[0].length > 0) {
      const dePass = cryptr.decrypt(result[0][0].pass)
      if (req.body.pass === dePass) {
        if (result[0][0].state === 'pasif') {
          res.json({ message: 'Hesap askıya alınmıştır' })
        } else if (result[0][0].logincheck === 'active' && result[0][0].multilogin === 0) {
          res.json({ message: 'Hesap Aktif durumdadır!' })
        } else if (result[0][0].fakelogin >= result[0][0].logincount) {
          res.json({ message: 'Hatalı giriş sınırı!' })
        } else{
          if (result[0][0].role === 'U1' || result[0][0].role === 'G1') {
            role = result[0][0].admin
          }else if(result[0][0].role === 'C1'){
            role = result[0][0].superadmin
          }else{
            role = result[0][0].user
          }
          if (result[0][0].role === 'U1' || result[0][0].role === 'C1'|| result[0][0].role === 'G1'){
            const settime = await conn.query('SELECT sk, sa FROM settime WHERE user = ?',[role])
            let time = moment().format('HH:mm')
            if (settime[0][0].sk !== null && time > settime[0][0].sk && settime[0][0].sa !== null && time < settime[0][0].sa) {
              res.json({message: 'Giriş Kapalı'})
            }else{
              insertLogin(conn, result[0][0])
            }
          }else{
            insertLogin(conn, result[0][0])
          }
        }
        }else{//password side
          checkLogincount(conn, result[0][0])
        }
    }else{
      res.json({ message: 'Geçersiz üye' })
    }
    async function checkLogincount(conn,value){
      if (value.fakelogin < value.logincount) {
        await conn.query('UPDATE users SET fakelogin = fakelogin + 1 WHERE user = ?', [user])
        res.json({ message: 'Geçersiz üye' })
      } else{
        res.json({ message: 'Hatalı giriş sınırı!' })
      }
    }
    async function insertLogin  (conn, value) {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null)
      ipAddr = ip
      let loginlog = {
        user: value.user,
        admin: value.admin,
        superadmin: value.superadmin,
        date: new Date(),
        proccess: 'Online',
        ip: ipAddr
      }
      await conn.query('UPDATE users SET logincheck = ?,sessioncount = sessioncount + 1 WHERE user = ?', ['active', user])
      await conn.query('INSERT INTO loginlog SET  ?', [loginlog])
      req.session.auth = value
      res.json({ code: 200, message: 'Giriş Başarılı', auth: value})
    }
  } 
}))
router.get('/logout', wrapAsync(async (req, res) => {
  let loginlog = {
    user: req.session.auth.user,
    admin: req.session.auth.admin,
    superadmin: req.session.auth.superadmin,
    date: new Date(),
    proccess: 'Offline',
    ip: ipAddr
  }
  const conn = await mysql.getConnection()
  conn.release()
  await conn.query('UPDATE users SET sessioncount = sessioncount - 1 WHERE user = ?', [req.session.auth.user])
  const result = await conn.query('SELECT sessioncount FROM users WHERE user = ?',[req.session.auth.user])
  if (result[0][0].sessioncount === 0) {
    await conn.query('UPDATE users SET logincheck = ? WHERE user = ?', ['passive', req.session.auth.user])
    await conn.query('INSERT INTO loginlog SET  ?', [loginlog])
    delete req.session.auth
    res.json({ ok: true })
  }else{
    await conn.query('INSERT INTO loginlog SET  ?', [loginlog])
    delete req.session.auth
    res.json({ ok: true })
  }
}))
router.put('/resetpass', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const result = await conn.query('Select user, nick FROM users WHERE user = ? LIMIT 1', [req.body.user])
  if (result[0].length === 1) {
    let newPass = cryptr.encrypt(req.body.pass)
    if (req.body.nick === result[0][0].nick) {
      await conn.query('UPDATE users SET pass = ?, logincheck = ?, fakelogin = ?,sessioncount = 0 WHERE user = ?', [newPass, 'passive',0 , req.body.user])
      res.json({code:200, message: 'Sıfırlama başarılı' } )
    } else {
      return res.json({ message: 'Gecersiz nick' })
    }
  } else {
    return res.json({ message: 'Gecersiz kullanici' })
  }
}))
router.post('/multilogin', wrapAsync(async (req, res)=>{
  const conn = await mysql.getConnection()
  conn.release()
  await conn.query('UPDATE users SET multilogin = ? WHERE user = ?', [req.body.multilogin, req.session.auth.user])
  res.json({ code: 200} )
}))

module.exports = router