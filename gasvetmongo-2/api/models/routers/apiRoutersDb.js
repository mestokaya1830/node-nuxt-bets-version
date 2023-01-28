const express = require('express')
const router = express.Router()
const wrapAsync = require('../../../middleware/wrapasync')
const Branches = require('../schemas/branchesSC')
const Soccermarkets = require('../schemas/soccermarketsSC')
const Basketmarkets = require('../schemas/basketmarketsSC')
const Soccerinplaymarkets = require('../schemas/soccerinplaymarketsSC')
const Basketinplaymarkets = require('../schemas/basketinplaymarketsSC')
const Settings = require('../schemas/settingsSC')

router.get('/branch', wrapAsync(async (req, res) => {
  const branch = await Branches.find({}, `bid bn ${req.session.auth.user}`).exec()
  res.json({ branch: branch})
})) 
router.put('/updatebranch', wrapAsync(async (req, res) => {
  await Branches.updateOne({bid: req.body.bid}, {$set:{[req.session.auth.user]: req.body.state}}).exec()
    if (!req.body.state) {
      let setting = new Settings({
        user:req.session.auth.user,
        admin:req.session.auth.admin,
        type:req.body.type,
        filterid:req.body.bid
      })
      await setting.save()
      res.json({message: 'done'})   
    } else {
      await Settings.deleteOne({user:req.session.auth.user, filterid: req.body.bid, type: req.body.type})
      res.json({message: 'done'})         
    }
}))
router.get('/markets/:id', wrapAsync(async (req, res) => {
  let market = ''
  switch (req.params.id) {
    case 'soccermarkets':
      market = await Soccermarkets.find({}, `mid mn ${req.session.auth.user}`).sort({mn: 1}).exec()
      res.json({ market: market})
      break;
    case 'basketmarkets':
      market = await Basketmarkets.find({}, `mid mn ${req.session.auth.user}`).sort({mn: 1}).exec()
      res.json({ market: market})
      break;
    case 'soccerinplaymarkets':
      market = await Soccerinplaymarkets.find({}, `mid mn ${req.session.auth.user}`).sort({mn: 1}).exec()
      res.json({ market: market})
      break;
    case 'basketinplaymarkets':
      market = await Basketinplaymarkets.find({}, `mid mn ${req.session.auth.user}`).sort({mn: 1}).exec()
      res.json({ market: market})
      break;
    default:
      break;
  }
}))
router.put('/updatemarkets', wrapAsync(async (req, res) => {
  switch (req.body.table) {
    case 'soccermarkets':
      Soccermarkets.updateOne({mid: req.body.mid}, {$set:{[req.session.auth.user]: req.body.state}}).exec()
      break;
    case 'basketmarkets':
      Basketmarkets.updateOne({mid: req.body.mid}, {$set:{[req.session.auth.user]: req.body.state}}).exec()
      break;
    case 'soccerinplaymarkets':
      Soccerinplaymarkets.updateOne({mid: req.body.mid}, {$set:{[req.session.auth.user]: req.body.state}}).exec()
      break;
    case 'basketinplaymarkets':
      Basketinplaymarkets.updateOne({mid: req.body.mid}, {$set:{[req.session.auth.user]: req.body.state}}).exec()
      break;
    default:
      break;
  }
  if (!req.body.state) {
    let setting = new Settings({
      user:req.session.auth.user,
      admin:req.session.auth.admin,
      type:req.body.type,
      filterid:req.body.mid
    })
    await setting.save()
    res.json({message: 'done'})   
  } else {
    await Settings.deleteOne({user:req.session.auth.user, filterid: req.body.mid, type: req.body.type})
    res.json({message: 'done'})         
  }
}))
router.put('/updaterates', wrapAsync(async (req, res) => {
    if (req.body.operate == 'Orjinal') {
      await Settings.deleteOne({user: req.session.auth.user, type: req.body.type})
      res.json({message: 'done'})
    } else {
      let setting = new Settings({
        user:req.session.auth.user,
        admin:req.session.auth.admin,
        operate:req.body.operate,
        type:req.body.type,
        filterid:0,
        rate:req.body.newrate
      })
      const result = await Settings.findOne({user: req.session.auth.user, type: req.body.type}).exec()
      if (result) {
        await setting.save()
        await Settings.deleteOne({user: req.session.auth.user, type: req.body.type})
        res.json({message: 'done'})
      }else{
        await setting.save()
        res.json({message: 'done'})
      }
    }
}))
router.put('/updatelimits', wrapAsync(async (req, res) => {
  if (req.body.operate == 'reset') {
    await Settings.deleteOne({user: req.session.auth.user, type: req.body.type})
    res.json({message: 'done'})
  } else {
    let setting = new Settings({
      user:req.session.auth.user,
      admin:req.session.auth.admin,
      operate:req.body.operate,
      type:req.body.typelimit,
      filterid:0,
      rate:req.body.ratelimit
    })
    const result = await Settings.findOne({user: req.session.auth.user, type: req.body.typelimit}).exec()
    if (result) {
      await setting.save()
      await Settings.deleteOne({user: req.session.auth.user, type: req.body.typelimit})
      res.json({message: 'done'})
    }else{
      await setting.save()
      res.json({message: 'done'})
    }
  }
}))
module.exports = router