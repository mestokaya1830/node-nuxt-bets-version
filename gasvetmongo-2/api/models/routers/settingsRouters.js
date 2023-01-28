const express = require('express')
const router = express.Router()
const mysql = require('../db')
const wrapAsync = require('../../../middleware/wrapasync')
const Settimes = require('../schemas/settimesSC')
const Setlimits = require('../schemas/setlimitsSC')
const Settings = require('../schemas/settingsSC')
const Anons = require('../schemas/anonsSC')
router.get('/settime', wrapAsync(async (req, res) => {
  let role = ''
  if (req.session.auth.role === 'U1' || req.session.auth.role === 'G1') {
    role = req.session.auth.admin
  }else if(req.session.auth.role === 'C1'){
    role = req.session.auth.superadmin
  }else if(req.session.auth.role === 'A2'){
    role = req.session.auth.user
  }else{return false}
  const data = await Settimes.findOne({user: role}).exec()
  res.json({ data: data })
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
  const data = await Setlimits.findOne({user: role}).exec()
  res.json({ data: data })
}))
router.put('/updatesettime', wrapAsync(async (req, res) => {
  await Settimes.updateOne({user: req.session.auth.user},{$set:{[req.body.column]: req.body.value}})
  res.json({ code: 200} )
}))
router.put('/updatesetlimit', wrapAsync(async (req, res) => {
  await Setlimits.updateOne({user: req.session.auth.user},{$set:{[req.body.column]: req.body.value}})
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
  const result = await Settings.find({user: role}).exec()
  res.json(result)   
}))
router.post('/setanons', wrapAsync(async (req, res) => {
  await Anons.deleteOne()
  const newAnons = new Anons({anons: req.body.anons})
  await newAnons.save()   
}))
router.post('/removeanons', wrapAsync(async (req, res) => {
  await Anons.deleteOne()
}))
router.get('/getanons', wrapAsync(async (req, res) => {
  const result = await Anons.findOne().exec()
  res.json({anons:result})   
}))
module.exports = router