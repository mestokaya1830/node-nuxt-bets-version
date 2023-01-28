const express = require('express')
const router = express.Router()
const Cryptr = require('cryptr')
const cryptr = new Cryptr('myTotalySecretKey')
const wrapAsync = require('../../../middleware/wrapasync')
const Users = require('../schemas/usersSC')
const Bets = require('../schemas/betsSC')
const Betsummaries = require('../schemas/betsummariesSC')
const Settimes = require('../schemas/settimesSC')
const Setlimits = require('../schemas/setlimitsSC')
const Loginlogs = require('../schemas/loginlogsSC')
const Creditlogs = require('../schemas/creditlogsSC')
const Gamelogs = require('../schemas/gamelogsSC')
const Settings = require('../schemas/settingsSC')
const Branches = require('../schemas/branchesSC')
const Basketmarkets = require('../schemas/basketmarketsSC')
const Basketinplaymarkets = require('../schemas/basketinplaymarketsSC')
const Soccermarkets = require('../schemas/soccermarketsSC')
const Soccerinplaymarkets = require('../schemas/soccerinplaymarketsSC')

router.post('/register', wrapAsync(async (req, res) => {
  let setrole = null
  if (req.body.role === 'Boss') {
    setrole = 'Superadmin'
  } else if (req.body.role === 'Superadmin') {
    setrole = 'Admin'
  } else if (req.body.role === 'Admin') {
    if (req.body.customer) {
      setrole = 'Subadmin'
    } else {
      setrole = 'Member'
    }
  } else {
    setrole = 'Submember'
  }
  const result = await Users.findOne({ user: req.session.auth.user }, 'admin userlimit usedlimit')
  if (result.usedlimit >= result.userlimit) {
    res.json({ code: 400, message: 'Limitiniz dolmuştur!' })
  } else {
    const users = await Users.find({ $or: [{ user: req.body.user }, { nick: req.body.nick }] }, 'user nick')
    if (users.length > 0) {
      if (users[0].user === req.body.user) {
        res.json({ message: 'Bu Add kullanilmaktadir' })
      } else {
        res.json({ message: 'Bu Nick kullanilmaktadir' })
      }
    } else {
      const newUsers = new Users({
        user: req.body.user,
        nick: req.body.nick,
        pass: cryptr.encrypt(req.body.pass),
        admin: req.body.admin,
        superadmin: result.admin,
        credit: req.body.credit,
        creditremain: req.body.credit,
        userlimit: req.body.userlimit,
        usedlimit: 0,
        role: setrole,
        payment: new Date()
      })
      const creditlogs = new Creditlogs({
        user: req.body.user,
        admin: req.body.admin,
        superadmin: result.admin,
        date: new Date(),
        amount: req.body.credit,
        credit: req.body.credit,
        creditremain: req.body.credit,
        ope: 'Ekleme',
        des: 'Yeni Kayıt'
      })
      const setlimits = new Setlimits({
        user: req.body.user,
        admin: req.session.auth.user,
        minms: 0,
        maxms: 0,
        minkm: 5,
        maxkm: 1000,
        maxrate: 1000,
        maxearn: 10000,
        maxkis: 0,
        maxkisremain: 0,
        cminms: 0,
        cmaxms: 0,
        cminkm: 5,
        cmaxkm: 1000,
        cmaxrate: 1000,
        cmaxearn: 10000
      })
      const settimes = new Settimes({
        user: req.body.user,
        admin: req.session.auth.user,
        ilkcba: 0,
        ilkcbk: 0,
        ikicba: 0,
        ikicbk: 0,
        sk: "00:00",
        sa: "00:00"
      })
      if (req.body.role === 'Superadmin') {
        await Users.updateOne({ user: req.session.auth.user }, { $inc: { usedlimit: + 1 } })
        await Branches.updateMany({}, { $set: { [req.body.user]: 1 } })
        await Basketmarkets.updateMany({}, { $set: { [req.body.user]: 1 } })
        await Basketinplaymarkets.updateMany({}, { $set: { [req.body.user]: 1 } })
        await Soccermarkets.updateMany({}, { $set: { [req.body.user]: 1 } })
        await Soccerinplaymarkets.updateMany({}, { $set: { [req.body.user]: 1 } })
        await newUsers.save()
        await setlimits.save()
        await settimes.save()
        res.json({ code: 200, message: 'Yeni kullanici eklendi' })
      } else if (req.body.role === 'Boss') {
        await Users.updateOne({ user: req.session.auth.user }, { $inc: { usedlimit: + 1 } })
        await newUsers.save()
        res.json({ code: 200, message: 'Yeni kullanici eklendi' })
      } else if (req.body.role === 'Subadmin') {
        if (newUsers.credit > req.session.auth.creditremain) {
          res.json({ message: 'Kredi Miktarı Çok Fazla!' })
        } else {
          await Users.updateOne({ user: req.session.auth.user }, { $inc: { usedlimit: + 1, creditremain: - newUsers.credit } })
          await newUsers.save()
          await creditlogs.save()
          res.json({ code: 200, message: 'Yeni kullanici eklendi' })
        }
      } else {
        await Users.updateOne({ user: req.session.auth.user }, { $inc: { usedlimit: + 1 } })
        await newUsers.save()
        await creditlogs.save()
        res.json({ code: 200, message: 'Yeni kullanici eklendi' })
      }
    }
  }
}))
router.get('/userlist', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Subadmin') {
    const userlist = await Users.find({ $or: [{ user: req.session.auth.user }, { admin: req.session.auth.user }] }, 'user')
    res.json({ userlist })
  } else {
    const userlist = await Users.find({ admin: req.session.auth.user }, 'user')
    res.json({ userlist })
  }
}))
router.get('/userlistgamelogs', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Subadmin') {
    const userlist = await Users.find({ $or: [{ user: req.session.auth.user }, { admin: req.session.auth.user }] }, 'user')
    res.json({ userlist })
  } else {
    const userlist = await Users.find({ $or: [{ admin: req.session.auth.user }, { superadmin: req.session.auth.user }] }, 'user')
    res.json({ userlist })
  }
}))
router.get('/userlistupdatecredit', wrapAsync(async (req, res) => {
  const userlist = await Users.find({ admin: req.session.auth.user }, 'user')
  res.json({ userlist })
}))
router.get('/users', wrapAsync(async (req, res) => {
  const users = await Users.find({ admin: req.session.auth.user })
  res.json({ users })
}))
router.post('/subusers', wrapAsync(async (req, res) => {
  const subuser = await Users.aggregate([
    { $match: { admin: { $in: req.body.users } } },
    { $group: { _id: "$admin", creditremain: { $sum: '$creditremain' } } },
    { $project: { admin: 1, creditremain: 1 } }
  ])
  res.json({ subuser })
}))
router.get('/users/:id', wrapAsync(async (req, res) => {
  const users = await Users.findOne({ user: req.params.id })
  res.json({ users })
}))
router.get("/activeusers", wrapAsync(async (req, res) => {
  const activeusers = await Users.aggregate([
    { $match: { admin: req.session.auth.user, logincheck: 'active' } },
    { $group: { _id: null, count: { $sum: 1 } } }])
  res.json({ code: 200, activeusers })
}))
router.get('/usersset', wrapAsync(async (req, res) => {
  const users = await Users.find({ user: req.session.auth.user }, 'user role admin state usercomission personcomission logincount logincheck autopay usercancelbet personcancelbet')
  res.json({ users })
}))
router.get('/profile', wrapAsync(async (req, res) => {
  const profile = await Users.findOne({ user: req.session.auth.user })
  res.json({ profile })
}))
router.delete('/usersdelete/:id', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Subadmin') {
    const activecount = await Betsummaries.findOne({ admin: req.params.id, state: "Aktif" }).limit(1)
    if (activecount !== null) {
      res.json({ message: 'Aktif kuponunuz var!' })
    } else {
      await Users.updateOne({ user: req.session.auth.user }, { $inc: { usedlimit: - 1 } })

      await Users.deleteOne({ user: req.params.id })
      await Creditlogs.deleteMany({ user: req.params.id })
      await Gamelogs.deleteMany({ user: req.params.id })
      await Loginlogs.deleteMany({ user: req.params.id })
      await Bets.deleteMany({ user: req.params.id })
      await Betsummaries.deleteMany({ user: req.params.id })

      res.json({ code: 200, message: 'Kullanıcı başarıyla silindi' })
    }
  } else if (req.session.auth.role === 'Admin') {
    const activecount = await Betsummaries.findOne({ $or: [{ user: req.params.id, state: "Aktif" }, { admin: req.params.id, state: "Aktif" }] }).limit(1)
    if (activecount !== null) {
      res.json({ message: 'Aktif kuponunuz var!' })
    } else {
      await Users.updateOne({ user: req.session.auth.user }, { $inc: { usedlimit: - 1 } })

      await Users.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Creditlogs.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Gamelogs.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Loginlogs.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Bets.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Betsummaries.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })

      res.json({ code: 200, message: 'Kullanıcı başarıyla silindi' })
    }
  } else if (req.session.auth.role === 'Superadmin') {
    const activecount = await Betsummaries.findOne({ $or: [{ admin: req.params.id, state: "Aktif" }, { superadmin: req.params.id, state: "Aktif" }] }).limit(1)
    if (activecount !== null) {
      res.json({ message: 'Aktif kuponunuz var!' })
    } else {
      await Users.updateOne({ user: req.session.auth.user }, { $inc: { usedlimit: - 1 } })

      await Users.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Creditlogs.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Gamelogs.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Loginlogs.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Bets.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Betsummaries.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Branches.updateMany({}, { $unset: { [req.params.id]: 1 } })
      await Basketmarkets.updateMany({}, { $unset: { [req.params.id]: 1 } })
      await Basketinplaymarkets.updateMany({}, { $unset: { [req.params.id]: 1 } })
      await Soccermarkets.updateMany({}, { $unset: { [req.params.id]: 1 } })
      await Soccerinplaymarkets.updateMany({}, { $unset: { [req.params.id]: 1 } })
      await Setlimits.deleteOne({ user: req.params.id })
      await Settimes.deleteOne({ user: req.params.id })
      await Settings.deleteMany({ user: req.params.id })

      await Branches.updateMany({}, { $unset: { [req.params.id]: 1 } })
      await Basketmarkets.updateMany({}, { $unset: { [req.params.id]: 1 } })
      await Basketinplaymarkets.updateMany({}, { $unset: { [req.params.id]: 1 } })
      await Soccermarkets.updateMany({}, { $unset: { [req.params.id]: 1 } })
      await Soccerinplaymarkets.updateMany({}, { $unset: { [req.params.id]: 1 } })

      res.json({ code: 200, message: 'Kullanıcı başarıyla silindi' })
    }
  } else if (req.session.auth.role === 'Boss') {
    //subuser section
    const subUser = await Users.find({ superadmin: req.params.id })
    const sa = subUser.map(item => item.admin)
    const activecount = await Betsummaries.find({ superadmin: { $in: sa }, state: 'Aktif' })
    if (activecount.length > 0) {
      res.json({ message: 'Aktif kuponunuz var!' })
    } else {
      await Users.deleteMany({ superadmin: { $in: sa } })
      await Creditlogs.deleteMany({ superadmin: { $in: sa } })
      await Gamelogs.deleteMany({ superadmin: { $in: sa } })
      await Loginlogs.deleteMany({ superadmin: { $in: sa } })
      await Bets.deleteMany({ superadmin: { $in: sa } })
      await Betsummaries.deleteMany({ superadmin: { $in: sa } })
      //

      const result = await Users.find({ admin: req.params.id })
      await Users.updateOne({ user: req.session.auth.user }, { $inc: { usedlimit: - 1 } })

      await Users.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Creditlogs.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Gamelogs.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Loginlogs.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Bets.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Betsummaries.deleteMany({ $or: [{ superadmin: req.params.id }, { admin: req.params.id }, { user: req.params.id }] })
      await Setlimits.deleteOne({ admin: req.params.id })
      await Settimes.deleteOne({ admin: req.params.id })
      await Settings.deleteMany({ admin: req.params.id })

      for (item of result) { await Branches.updateMany({}, { $unset: { [item.user]: 1 } }) }
      for (item of result) { await Basketmarkets.updateMany({}, { $unset: { [item.user]: 1 } }) }
      for (item of result) { await Basketinplaymarkets.updateMany({}, { $unset: { [item.user]: 1 } }) }
      for (item of result) { await Soccermarkets.updateMany({}, { $unset: { [item.user]: 1 } }) }
      for (item of result) { await Soccerinplaymarkets.updateMany({}, { $unset: { [item.user]: 1 } }) }

      res.json({ code: 200, message: 'Kullanıcı başarıyla silindi' })
    }
  } else {
    return false
  }
}
))
router.post('/usercomission', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Admin') {
    const usercomission = await Users.findOne({ user: req.body.userbox })
    res.json({ usercomission: usercomission.usercomission })
  } else {
    const usercomission = await Users.findOne({ user: req.session.auth.user })
    res.json({ usercomission: usercomission.usercomission })
  }
}))
router.put('/updateusercomission', wrapAsync(async (req, res) => {
  if (req.body.userbox === 'Üyeler') {
    await Users.updateOne({ user: req.session.auth.user }, { $set: { usercomission: req.body.usercomission } })
    await Users.updateOne({ user: req.session.auth.user, role: 'Member' }, { $set: { usercomission: req.body.usercomission } })
    res.json({ code: 200 })
  } else {
    await Users.updateOne({ user: req.body.user }, { $set: { usercomission: req.body.usercomission } })
    res.json({ code: 200 })
  }
}))
router.put('/updatepersoncomission', wrapAsync(async (req, res) => {
  if (req.body.userbox === 'Üyeler') {
    await Users.updateOne({ user: req.session.auth.user }, { $set: { personcomission: req.body.personcomission } })
    await Users.updateOne({ user: req.session.auth.user, role: 'Member' }, { $set: { personcomission: req.body.personcomission } })
    res.json({ code: 200 })
  } else {
    await Users.updateOne({ user: req.body.user }, { $set: { personcomission: req.body.personcomission } })
    res.json({ code: 200 })
  }
}))
router.put('/updateusercancelbet', wrapAsync(async (req, res) => {
  if (req.body.userbox === 'Üyeler') {
    await Users.updateOne({ user: req.session.auth.user }, { $set: { usercancelbet: req.body.usercancelbet } })
    await Users.updateOne({ user: req.session.auth.user, role: 'Member' }, { $set: { usercancelbet: req.body.usercancelbet } })
    res.json({ code: 200 })
  } else {
    await Users.updateOne({ user: req.body.user }, { $set: { usercancelbet: req.body.usercancelbet } })
    res.json({ code: 200 })
  }
}))
router.put('/updatepersoncancelbet', wrapAsync(async (req, res) => {
  if (req.body.userbox === 'Üyeler') {
    await Users.updateOne({ user: req.session.auth.user }, { $set: { personcancelbet: req.body.personcancelbet } })
    await Users.updateOne({ user: req.session.auth.user, role: 'Member' }, { $set: { personcancelbet: req.body.personcancelbet } })
    res.json({ code: 200 })
  } else {
    await Users.updateOne({ user: req.body.user }, { $set: { personcancelbet: req.body.personcancelbet } })
    res.json({ code: 200 })
  }
}))
router.put('/updatecreditremain/:id', wrapAsync(async (req, res) => {
  let ope = null
  let des = null
  if (req.body.operate === 'arti') {
    await Users.updateOne({ user: req.params.id }, { $inc: { creditremain: + req.body.updateamount } })
    await Users.updateOne({ user: req.session.auth.user }, { $inc: { creditremain: - req.body.updateamount } })
    ope = 'Eklendi'
    des = 'Bakiye Ekleme'
  } else {
    await Users.updateOne({ user: req.params.id }, { $inc: { creditremain: - req.body.updateamount } })
    await Users.updateOne({ user: req.session.auth.user }, { $inc: { creditremain: + req.body.updateamount } })
    ope = 'Eksildi'
    des = 'Ödeme'
  }
  const result = await Users.find({ user: req.params.id }, 'credit creditremain').limit(1)
  const creditlogs = new Creditlogs({
    user: req.params.id,
    admin: req.session.auth.user,
    superadmin: req.session.auth.admin,
    date: new Date(),
    amount: req.body.updateamount,
    credit: req.body.creditremain,
    creditremain: result[0].creditremain,
    ope,
    des
  })
  await creditlogs.save()
  res.json({ code: 200 })
}))
router.put('/updatestate/:id', wrapAsync(async (req, res) => {
  await Users.updateOne({ $or: [{ user: req.params.id }, { admin: req.params.id }, { superadmin: req.params.id }] }, { $set: { state: req.body.state } })
  res.json({ code: 200 })
}))
router.put('/updateuserlimit/:id', wrapAsync(async (req, res) => {
  await Users.updateOne({ user: req.params.id }, { $set: { userlimit: req.body.newlimit } })
  res.json({ code: 200 })
}))
router.put('/updatepayment/:id', wrapAsync(async (req, res) => {
  let currentDate = new Date()
  await Users.updateOne({ user: req.params.id }, { $set: { payment: currentDate } })
  res.json({ code: 200 })
}))
router.put('/updateprofile', wrapAsync(async (req, res) => {
  const result = await Users.findOne({ nick: req.body.nick }).limit(1)
  if (result) {
    res.json({ message: 'Bu nick kullanılmaktadır' })
  } else {
    await Users.updateOne({ user: req.session.auth.user }, { $set: { nick: req.body.nick } })
    res.json({ code: 200 })
  }
}))
router.put('/updateautopay', wrapAsync(async (req, res) => {
  await Users.updateOne({ user: req.session.auth.user }, { $set: { autopay: req.body.autopay } })
  res.json({ code: 200 })
}))
router.put('/updatelogincount', wrapAsync(async (req, res) => {
  await Users.updateOne({ user: req.session.auth.user }, { $set: { logincount: req.body.logincount } })
  res.json({ code: 200 })
}))
router.post('/creditinfo', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Subadmin' || req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const creditinfo = await Users.findOne({ user: req.session.auth.user }, 'credit creditremain')
    res.json({ creditinfo })
  } else {
    if (req.body.userbox === 'Üyeler') {
      const creditinfo = await Users.aggregate([
        { $match: { admin: req.session.auth.user } },
        { $group: { _id: null, credit: { $sum: '$credit' }, creditremain: { $sum: '$creditremain' } } }])
      res.json({ creditinfo: creditinfo[0] })
    } else {
      const creditinfo = await Users.find({ user: req.body.userbox }, 'credit creditremain')
      res.json({ creditinfo: creditinfo[0] })
    }
  }
}))
router.post('/subcredit', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Subadmin') {
    const subcredit = await Users.aggregate([
      { $match: { admin: req.session.auth.user } },
      { $group: { _id: null, subcredit: { $sum: '$creditremain' } } }])
    res.json({ subcredit: subcredit[0] })
  } else {
    if (req.body.userbox === 'Üyeler') {
      const subcredit = await Users.aggregate([
        { $match: { superadmin: req.session.auth.user } },
        { $group: { _id: null, subcredit: { $sum: '$creditremain' } } }])
      res.json({ subcredit: subcredit[0] })
    } else {
      const subcredit = await Users.aggregate([
        { $match: { admin: req.body.userbox } },
        { $group: { _id: null, subcredit: { $sum: '$creditremain' } } }])
      res.json({ subcredit: subcredit[0] })
    }
  }
}))
router.post('/creditlogs', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const creditlog = await Creditlogs.find({ user: req.session.auth.user }).sort({ date: -1 }).limit(50)
    res.json({ creditlog })
  } else {
    const creditlog = await Creditlogs.find({ user: req.body.userbox }).sort({ date: -1 }).limit(50)
    res.json({ creditlog })
  }
}))
router.post('/creditlogs/datefilter', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const datefilter = await Creditlogs.find({ user: req.session.auth.user, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ date: -1 })
    res.json({ datefilter })
  } else {
    const datefilter = await Creditlogs.find({ user: req.body.userbox, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ date: -1 })
    res.json({ datefilter })
  }
}))
router.post('/loginlogs', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const loginlog = await Loginlogs.find({ user: req.session.auth.user }).sort({ date: -1 }).limit(50)
    res.json({ loginlog })
  } else {
    const loginlog = await Loginlogs.find({ user: req.body.userbox }).sort({ date: -1 }).limit(50)
    res.json({ loginlog })
  }
}))
router.post('/loginlogs/datefilter', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const datefilter = await Loginlogs.find({ user: req.session.auth.user, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ date: -1 })
    res.json({ datefilter })
  } else {
    const datefilter = await Loginlogs.find({ user: req.body.userbox, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ date: -1 })
    res.json({ datefilter })
  }
}))

module.exports = router