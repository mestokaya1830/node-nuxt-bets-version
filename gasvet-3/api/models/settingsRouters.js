const express = require('express')
const router = express.Router()
const mysql = require('./db')
const wrapAsync = require('../../middleware/wrapasync')

router.get('/settime', wrapAsync(async (req, res) => {
  let role = ''
  if (req.session.auth.role === 'U1' || req.session.auth.role === 'G1') {
    role = req.session.auth.admin
  }else if(req.session.auth.role === 'C1'){
    role = req.session.auth.superadmin
  }else if(req.session.auth.role === 'A2'){
    role = req.session.auth.user
  }else{return false}
  const conn = await  mysql.getConnection()
  conn.release()
  const data = await conn.query('SELECT user, ilkcba, ilkcbk, ikicba, ikicbk, sa, sk FROM settime WHERE user = ?', [role])
  res.json({ data: data[0][0] })
}))
router.get('/setlimit', wrapAsync(async (req, res) => {
  let role = ''
  if (req.session.auth.role === 'U1' || req.session.auth.role === 'G1') {
    role = req.session.auth.admin
  }else if(req.session.auth.role === 'C1'){
    role = req.session.auth.superadmin
  }else if(req.session.auth.role === 'A2'){
    role = req.session.auth.user
  }else{return false}
  const conn = await  mysql.getConnection()
  conn.release()
  const data = await conn.query('SELECT user, minms, maxms, minkm, maxkm, maxrate, maxearn, maxkis, maxkisremain, cmaxrate, cminms, cmaxms, cminkm, cmaxkm, cmaxearn FROM setlimit WHERE user = ?', [role])
  res.json({ data: data[0][0] })
}))
router.put('/updatesettime', wrapAsync(async (req, res) => {
  const conn = await  mysql.getConnection()
  conn.release()
  await conn.query('UPDATE settime SET '+ req.body.column +' = ? WHERE user = ?', [req.body.value, req.session.auth.user])
  res.json({ code: 200} )
}))
router.put('/updatesetlimit', wrapAsync(async (req, res) => {
  const conn = await  mysql.getConnection()
  conn.release()
  await conn.query('UPDATE setlimit SET '+req.body.column +' = ? WHERE user = ?', [req.body.value, req.session.auth.user])
  res.json({ code: 200} )
}))
router.get('/settings', wrapAsync(async (req, res) => {
  let role = ''
  if (req.session.auth.role === 'U1' || req.session.auth.role === 'G1') {
    role = req.session.auth.admin
  }else if(req.session.auth.role === 'C1'){
    role = req.session.auth.superadmin
  }else if(req.session.auth.role === 'A2'){
    role = req.session.auth.user
  }else{return false}
  const conn = await  mysql.getConnection()
  conn.release()
  const result = await conn.query('SELECT * FROM settings WHERE user = ?',[role])
  res.json(result[0])   
}))
router.post('/setanons', wrapAsync(async (req, res) => {
  const conn = await  mysql.getConnection()
  conn.release()
  await conn.query('DELETE FROM anons')
  await conn.query('INSERT INTO anons(anons)VALUES("'+req.body.anons+'")')   
}))
router.post('/removeanons', wrapAsync(async (req, res) => {
  const conn = await  mysql.getConnection()
  conn.release()
  await conn.query('DELETE FROM anons')
}))
router.get('/getanons', wrapAsync(async (req, res) => {
  const conn = await  mysql.getConnection()
  conn.release()
  const result = await conn.query('SELECT anons FROM anons LIMIT 1')
  res.json({anons:result[0]})   
}))
module.exports = router