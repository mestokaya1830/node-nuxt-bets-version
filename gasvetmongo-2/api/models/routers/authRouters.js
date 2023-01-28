const express = require('express')
const router = express.Router()
const Cryptr = require('cryptr')
const cryptr = new Cryptr('myTotalySecretKey')
const moment = require('moment-timezone')
const wrapAsync = require('../../../middleware/wrapasync')
const Users = require('../schemas/usersSC')
const Loginlogs = require('../schemas/loginlogsSC')
const Settimes = require('../schemas/settimesSC')
let ipAddr = ''
let role = ''

router.post('/login', wrapAsync(async (req, res) => {     
  let loginuser = req.body.user
  if (loginuser) {
    const result = await Users.findOne({user: loginuser}).exec()
    if (result) {
      if (req.body.pass === String(cryptr.decrypt(result.pass))) {
        if (result.state === 'pasif') {
          res.json({ message: 'Hesap askıya alınmıştır' })
        } else if (result.logincheck === 'active' && !result.multilogin) {
          res.json({ message: 'Hesap Aktif durumdadır!' })
        } else if (result.fakelogin >= result.logincount) {
          res.json({ message: 'Hatalı giriş sınırı!' })
        } else{
          if (result.role === 'U1' || result.role === 'G1') {
            role = result.admin
          }else if(result.role === 'C1'){
            role = result.superadmin
          }else{
            role = result.user
          }
          if (result.role === 'G1' || result.role === 'U1'|| result.role === 'C1'){
            const settime = await Settimes.find({user: role}, 'sk sa')
            let time = moment().format('HH:mm')
            if (settime[0].sk !== null && time > settime[0].sk && settime[0].sa !== null && time < settime[0].sa) {
              res.json({message: 'Giriş Kapalı'})
            }else{
              insertLogin(result)
            }
          }else{
            insertLogin(result)
          }
        }
        }else{
          checkLogincount(result)
        }
    }else{
      res.json({ message: 'Geçersiz üye' })
    }
    async function checkLogincount(value){
      if (value.fakelogin < value.logincount) {
        await Users.updateOne({user: loginuser}, {$inc: {fakelogin: + 1}})
        res.json({ message: 'Geçersiz üye' })
      } else{
        res.json({ message: 'Hatalı giriş sınırı!' })
      }
    }
    async function insertLogin  (value) {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null)
      ipAddr = ip
      let loginlogs = new Loginlogs({
        user: value.user,
        admin: value.admin,
        superadmin: value.superadmin,
        date: new Date(),
        proccess: 'Online',
        ip: ipAddr
      })
      await Users.updateOne({user: loginuser},{logincheck: 'active', $inc: {sessioncount: + 1}})
      await loginlogs.save()
      req.session.auth = value
      res.json({ code: 200, message: 'Giriş Başarılı', auth: value})
    }
  } 
}))
router.get('/logout', wrapAsync(async (req, res) => {
  let loginlogs = new Loginlogs({
    user: req.session.auth.user,
    admin: req.session.auth.admin,
    superadmin: req.session.auth.superadmin,
    date: new Date(),
    proccess: 'Offline',
    ip: ipAddr
  })
  await Users.updateOne({user: req.session.auth.user},{$inc: {sessioncount: - 1}})
  const result = await Users.findOne({user: req.session.auth.user}, 'sessioncount').exec()
  if (result.sessioncount === 0) {
    await Users.updateOne({user: req.session.auth.user},{logincheck:'passive'})
    await loginlogs.save()
    delete req.session.auth
    res.json({ ok: true })
  }else{
    await loginlogs.save()
    delete req.session.auth
    res.json({ ok: true })
  }
}))
router.put('/resetpass', wrapAsync(async (req, res) => {
  const result = await Users.findOne({user: req.body.user}, 'user nick').exec()
  if (result) {
    let newPass = cryptr.encrypt(req.body.pass)
    if (req.body.nick === result.nick) {
      await Users.updateOne({user: req.body.user},{pass: newPass, logincheck: 'passive', fakelogin: 0, sessioncount: 0})
      res.json({code:200, message: 'Sıfırlama başarılı' } )
    } else {
      return res.json({ message: 'Gecersiz nick' })
    }
  } else {
    return res.json({ message: 'Gecersiz kullanici' })
  }
}))
router.post('/multilogin', wrapAsync(async (req, res)=>{
  await Users.updateOne({user: req.session.auth.user},{multilogin: req.body.multilogin})
  res.json({ code: 200} )
}))

module.exports = router