const express = require('express')
const router = express.Router()
const mysql = require('./db')
const wrapAsync = require('../../middleware/wrapasync')

router.get("/chat", wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const chatuser = await conn.query('SELECT user, logincheck, (SELECT COUNT(id) FROM messages WHERE sender = users.user and receiver = ? and readed = ?) AS count FROM users WHERE user = ?', [req.session.auth.user, 'no', req.session.auth.admin])
    res.json({ chatuser: chatuser[0] })
  } else {
    const chatuser = await conn.query('SELECT user, admin, logincheck, (SELECT COUNT(id) FROM messages WHERE sender = users.user and receiver = ? and readed = ?) AS count FROM users WHERE user = ? || admin = ?', [req.session.auth.user, 'no', req.session.auth.admin, req.session.auth.user])
    res.json({ chatuser: chatuser[0] })
  }
}))
router.post("/getmsg", wrapAsync(async (req, res) => {
  const sender = req.body.sender + "-" + req.body.receiver
  const receiver = req.body.receiver + "-" + req.body.sender
  const conn = await mysql.getConnection()
  conn.release()
  const getmsg = await conn.query('SELECT msg, date, sender, receiver, readed FROM messages WHERE betweenmsg = "' + sender + '" || betweenmsg = "' + receiver + '"')
  res.json({ getmsg: getmsg[0] })
}))
router.post("/deletemsg", wrapAsync(async (req, res) => {
  const sender = req.body.sender + "-" + req.body.receiver
  const receiver = req.body.receiver + "-" + req.body.sender
  const conn = await mysql.getConnection()
  conn.release()
  await conn.query('DELETE FROM messages WHERE betweenmsg = "' + sender + '" || betweenmsg = "' + receiver + '"')
  res.json({ message: "Mesajlar başarıyla silindi" })
}))
router.post("/updatemsg", wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  await conn.query('UPDATE messages SET readed = ? WHERE sender = ? And receiver = ?', ['Yes', req.body.sender, req.session.auth.user])
  res.json({status:'Done'})
}))
router.get("/msgcount", wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const result = await conn.query('SELECT Count(*) As count FROM messages  WHERE receiver = ? And readed = ? GROUP BY receiver', [req.session.auth.user, 'No'])
  if (result[0].length > 0) {
    res.json({message: result[0][0].count })
  }else{
    res.json({message:'null'})
  }
}))

module.exports = router
