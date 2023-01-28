const express = require('express')
const router = express.Router()
const mysql = require('./db')
const wrapAsync = require('../../middleware/wrapasync')

router.get('/branch', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const data = await conn.query(`SELECT bid, bn, ${req.session.auth.user} FROM branch  ORDER BY id`)
  res.json({ data: data[0]})
})) 
router.put('/updatebranch', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    await conn.query(`UPDATE branch SET ${req.session.auth.user} = ? WHERE bid = ?`, [req.body.state, req.body.bid])
    if (!req.body.state) {
      let newset = {
        user:req.session.auth.user,
        admin:req.session.auth.admin,
        type:req.body.type,
        filterid:req.body.bid
      }
      await conn.query('INSERT INTO settings SET ?',[newset])
      res.json({message: 'done'})   
    } else {
      await conn.query('DELETE FROM settings WHERE user = ? AND filterid = ? AND type = ?',[req.session.auth.user, req.body.bid, req.body.type])
      res.json({message: 'done'})         
    }
}))
router.get('/leagues/:id', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const data = await conn.query(`SELECT cn,lid,ln,${req.session.auth.user} FROM ${req.params.id}  ORDER BY cn`)
  res.json({ data: data[0]})
}))
router.get('/markets/:id', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const data = await conn.query(`SELECT mid,mn, ${req.session.auth.user} FROM ${req.params.id} ORDER BY mn`)
  res.json({ data: data[0]})
}))
router.put('/updateleagues', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    await conn.query(`UPDATE ${req.body.table} SET ${req.session.auth.user} = ? WHERE lid = ?`, [req.body.state, req.body.lid])
    if (!req.body.state) {
      let newset = {
        user:req.session.auth.user,
        admin:req.session.auth.admin,
        type:req.body.type,
        filterid:req.body.lid
      }
      await conn.query('INSERT INTO settings SET ?',[newset])
      res.json({message: 'done'})   
    } else {
      await conn.query('DELETE FROM settings WHERE user = ? AND filterid = ? AND type = ?',[req.session.auth.user, req.body.lid, req.body.type])
      res.json({message: 'done'})         
    }
}))
router.put('/updatemarkets', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    await conn.query(`UPDATE ${req.body.table} SET ${req.session.auth.user} = ? WHERE mid = ?`, [req.body.state, req.body.mid])
    if (!req.body.state) {
      const newset = {
        user:req.session.auth.user,
        admin:req.session.auth.admin,
        type:req.body.type,
        filterid:req.body.mid
      }
      await conn.query('INSERT INTO settings SET ?',[newset])
      res.json({message: 'done'})
    } else {
      await conn.query(`DELETE FROM settings WHERE user = ? AND filterid = ? AND type = ?`,[req.session.auth.user, req.body.mid, req.body.type])
      res.json({message: 'done'})
    }
}))
router.put('/updaterates', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    if (req.body.operate == 'Orjinal') {
      await conn.query('DELETE FROM settings WHERE user = ? AND type = ?',[req.session.auth.user, req.body.type])
      res.json({message: 'done'})
    } else {
      const newset = {
        user:req.session.auth.user,
        admin:req.session.auth.admin,
        operate:req.body.operate,
        type:req.body.type,
        filterid:0,
        rate:req.body.newrate
      }
      const result = await conn.query('SELECT user, type FROM settings WHERE user = ? AND type = ? Limit 1',[req.session.auth.user, req.body.type])
      if (result[0].length > 0) {
        await conn.query('DELETE FROM settings WHERE user = ? AND type = ?',[req.session.auth.user, req.body.type])
        await conn.query('INSERT INTO settings SET ?',[newset])
        res.json({message: 'done'})
      }else{
        await conn.query('INSERT INTO settings SET ?',[newset])
        res.json({message: 'done'})
      }
    }
}))
router.put('/updatelimits', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    if (req.body.operate === 'reset') {
      await conn.query('DELETE FROM settings WHERE user = ? AND type = ?',[req.session.auth.user, req.body.typelimit])
      res.json({message: 'done'})
    } else {
      const newset = {
        user:req.session.auth.user,
        admin:req.session.auth.admin,
        operate:req.body.operate,
        type:req.body.typelimit,
        filterid:0,
        rate:req.body.ratelimit
      }
      const result = await conn.query('SELECT user, type FROM settings WHERE user = ? AND type = ? Limit 1',[req.session.auth.user, req.body.typelimit])
      if (result[0].length > 0) {
        await conn.query('DELETE FROM settings WHERE user = ? AND type = ?',[req.session.auth.user, req.body.typelimit])
        await conn.query('INSERT INTO settings SET ?',[newset])
        res.json({message: 'done'})
      }else{
        await conn.query('INSERT INTO settings SET ?',[newset])
        res.json({message: 'done'})
      }
    }
}))

module.exports = router
