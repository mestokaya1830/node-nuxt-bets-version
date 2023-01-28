const express = require('express')
const router = express.Router()
const wrapAsync = require('../../../middleware/wrapasync')
const Settimes = require('../schemas/settimesSC')
const Setlimits = require('../schemas/setlimitsSC')
const Settings = require('../schemas/settingsSC')
const Anons = require('../schemas/anonsSC')

router.get('/settime', wrapAsync(async (req, res) => {
  let role = ''
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Subadmin') {
    role = req.session.auth.admin
  } else if (req.session.auth.role === 'Submember') {
    role = req.session.auth.superadmin
  } else if (req.session.auth.role === 'Admin') {
    role = req.session.auth.user
  } else {
    return false
  }
  const data = await Settimes.findOne({ user: role })
  res.json({ data })
}))
router.get('/setlimit', wrapAsync(async (req, res) => {
  let role = ''
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Subadmin') {
    role = req.session.auth.admin
  } else if (req.session.auth.role === 'Submember') {
    role = req.session.auth.superadmin
  } else if (req.session.auth.role === 'Admin') {
    role = req.session.auth.user
  } else {
    return false
  }
  const data = await Setlimits.findOne({ user: role })
  res.json({ data })
}))
router.put('/updatesettime', wrapAsync(async (req, res) => {
  await Settimes.updateOne({ user: req.session.auth.user }, { $set: { [req.body.column]: req.body.value } })
  res.json({ code: 200 })
}))
router.put('/updatesetlimit', wrapAsync(async (req, res) => {
  await Setlimits.updateOne({ user: req.session.auth.user }, { $set: { [req.body.column]: req.body.value } })
  res.json({ code: 200 })
}))
router.get('/settings', wrapAsync(async (req, res) => {
  let role = ''
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Subadmin') {
    role = req.session.auth.admin
  } else if (req.session.auth.role === 'Submember') {
    role = req.session.auth.superadmin
  } else if (req.session.auth.role === 'Admin') {
    role = req.session.auth.user
  } else {
    return false
  }
  const result = await Settings.find({ user: role })
  res.json({ result })
}))
router.post('/setanons', wrapAsync(async (req, res) => {
  await Anons.deleteOne()
  const newAnons = new Anons({ anons: req.body.anons })
  await newAnons.save()
}))
router.post('/removeanons', wrapAsync(async (req, res) => {
  await Anons.deleteOne()
}))
router.get('/getanons', wrapAsync(async (req, res) => {
  const anons = await Anons.findOne()
  res.json({ anons })
}))

module.exports = router