const express = require('express')
const router = express.Router()
const Cryptr = require('cryptr')
const cryptr = new Cryptr('myTotalySecretKey')
const wrapAsync = require('../../../middleware/wrapasync')
const Users = require('../schemas/usersSC')
const Bets = require('../schemas/betsSC')
const Betshistories = require('../schemas/betshistoriesSc')
const Betsummaries = require('../schemas/betsummariesSC')
const Betsummaryhistories = require('../schemas/betsummaryhistoriesSC')
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
  if (req.body.role === 'B4') {
    setrole = 'S3'
  } else if (req.body.role === 'S3') {
    setrole = 'A2'
  } else if (req.body.role === 'A2') {
    if (req.body.customer) {
      setrole = 'G1'
    } else {
      setrole = 'U1'
    }
  }else{
    setrole = 'C1'
  }
    const result = await Users.findOne({user: req.session.auth.user}, 'admin userlimit usedlimit')
    if (result.usedlimit >= result.userlimit) {
      res.json({code: 400, message: 'Limitiniz dolmuştur!'})
    } else {
      const users = await Users.find({$or :[{user: req.body.user},{nick: req.body.nick}]}, 'user nick')
      if (users.length > 0) {
        if (users[0].user === req.body.user) {
          res.json({ message: 'Bu Add kullanilmaktadir' })
        }else{
          res.json({ message: 'Bu Nick kullanilmaktadir' })
        }
      }else {
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
        const creditlogs = new Creditlogs ({
          user: req.body.user,
          admin: req.body.admin,
          superadmin: result.admin,
          date: new Date(),
          amount: req.body.credit,
          credit: req.body.credit,
          creditremain: req.body.credit,
          ope: 'Limit',
          des: 'Yeni Kayıt'
        })
        const setlimits = new Setlimits ({
          user:req.body.user,
          admin:req.session.auth.user,
          minms:0,
          maxms:0,
          minkm:5,
          maxkm:1000,
          maxrate:1000,
          maxearn:10000,
          maxkis:0,
          maxkisremain:0,
          cminms:0,
          cmaxms:0,
          cminkm:5,
          cmaxkm:1000,
          cmaxrate:1000,
          cmaxearn:10000
        })
        const settimes = new Settimes ({
          user:req.body.user,
          admin:req.session.auth.user,
          ilkcba:0,
          ilkcbk:0,
          ikicba:0,
          ikicbk:0,
          sk:"00:00",
          sa:"00:00"
        })
        if (req.body.role === 'S3'){
          await Users.updateOne({user: req.session.auth.user}, {$inc:{usedlimit: + 1}})
          await Branches.updateMany({}, {$set:{[req.body.user]:1}})
          await Basketmarkets.updateMany({}, {$set:{[req.body.user]:1}})
          await Basketinplaymarkets.updateMany({}, {$set:{[req.body.user]:1}})
          await Soccermarkets.updateMany({}, {$set:{[req.body.user]:1}})
          await Soccerinplaymarkets.updateMany({}, {$set:{[req.body.user]:1}})
          await newUsers.save()
          await setlimits.save()
          await settimes.save()
          res.json({code: 200, message: 'Yeni kullanici eklendi'})
        }else if(req.body.role === 'B4'){
          await Users.updateOne({user: req.session.auth.user}, {$inc:{usedlimit: + 1}})
          await newUsers.save()
          res.json({code: 200, message: 'Yeni kullanici eklendi'})
        }else if(req.body.role === 'G1'){
          if (newUsers.credit > req.session.auth.creditremain) {
            res.json({message: 'Kredi Miktarı Çok Fazla!'})
          } else {
            await Users.updateOne({user: req.session.auth.user}, {$inc:{usedlimit: + 1, creditremain: - newUsers.credit}})
            await newUsers.save()
            await creditlogs.save()
            res.json({code: 200, message: 'Yeni kullanici eklendi'})
          }
        }else{
          await Users.updateOne({user: req.session.auth.user}, {$inc:{usedlimit: + 1}})
          await newUsers.save()
          await creditlogs.save()
          res.json({code: 200, message: 'Yeni kullanici eklendi'})
        }
      }
    }
}))
router.get('/userlist', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'G1') {
    const userlist = await Users.find({$or: [{user: req.session.auth.user},{admin: req.session.auth.user}]}, 'user').exec()
    res.json({ userlist: userlist })
  }else{
    const userlist = await Users.find({admin: req.session.auth.user}, 'user').exec()
    res.json({ userlist: userlist })
  }
}))
router.get('/userlistgamelogs', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'G1') {
    const userlist = await Users.find({$or: [{user: req.session.auth.user},{admin: req.session.auth.user}]}, 'user').exec()
    res.json({ userlist: userlist })
  }else{
    const userlist = await Users.find({$or: [{admin: req.session.auth.user},{superadmin: req.session.auth.user}]}, 'user').exec()
    res.json({ userlist: userlist })
  }
}))
router.get('/userlistupdatecredit', wrapAsync(async (req, res) => {
  const userlist = await Users.find({admin: req.session.auth.user}, 'user').exec()
  res.json({ userlist: userlist })
}))
router.get('/userlistresetaccount', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'G1'){
    const userlist = await Users.find({$or: [{user: req.session.auth.user},{admin: req.session.auth.user}]}, 'user role').exec()
    res.json({ userlist: userlist })
  }else{
    const userlist = await Users.find({admin: req.session.auth.user}, 'user role').exec()
    res.json({ userlist: userlist })
  }
}))
router.get('/userlistcomission', wrapAsync(async (req, res) => {
  const userlist = await Users.find({$or: [{user: req.session.auth.user, role: 'C1'},{admin: req.session.auth.user, role: 'C1'}]}, 'user personcomission').exec()
  res.json({ userlist: userlist })
}))
router.get('/users', wrapAsync(async (req, res) => {
  const users = await Users.find({admin: req.session.auth.user}).exec()
  res.json({ users: users})
}))
router.post('/subusers', wrapAsync(async (req, res) => {
  const subuser = await Users.aggregate([
    {$match: {admin: {$in: req.body.users}}},
    {$group: {_id:"$admin", creditremain: {$sum: '$creditremain'}}},
    {$project: {admin:1, creditremain:1}}
  ])
  res.json({ subuser: subuser})
}))
router.get('/users/:id', wrapAsync(async (req, res) => {
  const users = await Users.findOne({user: req.params.id}).exec()
  res.json({users: users})
}))
router.get("/activeusers", wrapAsync(async (req, res) => {
  const result = await Users.aggregate([
    {$match: {admin: req.session.auth.user, logincheck: 'active'}},
    {$group: {_id:null, count: {$sum: 1}}}])
    res.json({code: 200, activeusers: result[0].count })
}))
router.get('/usersset', wrapAsync(async (req, res) => {
  const result = await Users.find({user:req.session.auth.user}, 'user role admin state usercomission personcomission logincount logincheck autopay usercancelbet personcancelbet')
  res.json({ users: result})
}))
router.get('/profile', wrapAsync(async (req, res) => {
  const profile = await Users.findOne({user: req.session.auth.user})
  res.json({profile: profile})
}))
router.delete('/usersdelete/:id', wrapAsync(async (req, res) => {
    if (req.session.auth.role === 'G1') {
      const activecount = await Betsummaries.findOne({admin: req.params.id, state:"Aktif"}).limit(1).exec()
      if (activecount !== null) {
        res.json({ message: 'Aktif kuponunuz var!' })
      } else {
        await Users.updateOne({user: req.session.auth.user},{$inc: {usedlimit: - 1}})
        await Users.deleteOne({user: req.params.id})
        await Creditlogs.deleteMany({user: req.params.id})
        await Gamelogs.deleteMany({user: req.params.id})
        await Loginlogs.deleteMany({user: req.params.id})
        await Bets.deleteMany({user: req.params.id})
        await Betshistories.deleteMany({user: req.params.id})
        await Betsummaries.deleteMany({user: req.params.id})
        await Betsummaryhistories.deleteMany({user: req.params.id})
        res.json({code: 200, message: 'Kullanıcı başarıyla silindi' })
      }
    }else if (req.session.auth.role === 'A2') {
      const activecount = await Betsummaries.findOne({$or:[{user: req.params.id, state:"Aktif"}, {admin: req.params.id, state:"Aktif"}]}).limit(1).exec()
      if (activecount !== null) {
        res.json({ message: 'Aktif kuponunuz var!' })
      } else {
        await Users.updateOne({user: req.session.auth.user},{$inc: {usedlimit: - 1}})
        await Users.deleteMany({$or: [{user: req.params.id},{admin: req.params.id}]})
        await Creditlogs.deleteMany({$or: [{user: req.params.id},{admin: req.params.id}]})
        await Gamelogs.deleteMany({$or: [{user: req.params.id},{admin: req.params.id}]})
        await Loginlogs.deleteMany({$or: [{user: req.params.id},{admin: req.params.id}]})
        await Bets.deleteMany({$or: [{user: req.params.id},{admin: req.params.id}]})
        await Betshistories.deleteMany({$or: [{user: req.params.id},{admin: req.params.id}]})
        await Betsummaries.deleteMany({$or: [{user: req.params.id},{admin: req.params.id}]})
        await Betsummaryhistories.deleteMany({$or: [{user: req.params.id},{admin: req.params.id}]})
        res.json({code: 200, message: 'Kullanıcı başarıyla silindi' })
      }
    }else if (req.session.auth.role === 'S3') {
      const activecount = await Betsummaries.findOne({$or:[{admin: req.params.id, state:"Aktif"}, {superadmin: req.params.id, state:"Aktif"}]}).limit(1).exec()
      if (activecount !== null) {
        res.json({ message: 'Aktif kuponunuz var!' })
      } else {
        await Users.updateOne({user: req.session.auth.user},{$inc: {usedlimit: - 1}})
        await Users.deleteMany({$or: [{user: req.params.id},{admin: req.params.id},{superadmin: req.params.id}]})
        await Creditlogs.deleteMany({$or: [{admin: req.params.id},{superadmin: req.params.id}]})
        await Gamelogs.deleteMany({$or: [{admin: req.params.id},{superadmin: req.params.id}]})
        await Loginlogs.deleteMany({$or: [{admin: req.params.id},{superadmin: req.params.id}]})
        await Setlimits.deleteOne({user: req.params.id})
        await Settimes.deleteOne({user: req.params.id})
        await Settings.deleteOne({user: req.params.id})
        await Bets.deleteMany({$or: [{admin: req.params.id},{superadmin: req.params.id}]})
        await Betshistories.deleteMany({$or: [{admin: req.params.id},{superadmin: req.params.id}]})
        await Betsummaries.deleteMany({$or: [{admin: req.params.id},{superadmin: req.params.id}]})
        await Betsummaryhistories.deleteMany({$or: [{admin: req.params.id},{superadmin: req.params.id}]})
        await Branches.updateMany({}, {$unset:{[req.params.id]: 1}})
        await Basketmarkets.updateMany({}, {$unset:{[req.params.id]: 1}})
        await Basketinplaymarkets.updateMany({}, {$unset:{[req.params.id]: 1}})
        await Soccermarkets.updateMany({}, {$unset:{[req.params.id]: 1}})
        await Soccerinplaymarkets.updateMany({}, {$unset:{[req.params.id]: 1}})
        res.json({code: 200, message: 'Kullanıcı başarıyla silindi' })
    }
    }else if (req.session.auth.role === 'B4') {
      await Users.updateOne({user: req.session.auth.user},{$inc: {usedlimit: - 1}})
      const result = await Users.findOne({user: req.params.id}).exec()
      if (result.length > 0) {
        await Users.deleteMany({$or: [{user: req.params.id},{admin: req.params.id},{superadmin: req.params.id}]})
        await Settings.deleteOne({admin: req.params.id})
        await Setlimits.deleteOne({admin: req.params.id})
        await Settimes.deleteOne({admin: req.params.id})
        await Creditlogs.deleteMany({superadmin: req.params.id})
        await Gamelogs.deleteMany({superadmin: req.params.id})
        await Loginlogs.deleteMany({$or: [{user:req.params.id}, {admin: req.params.id},{superadmin: req.params.id}]})
        await Bets.deleteMany({$or: [{admin: req.params.id},{superadmin: req.params.id}]})
        await Betshistories.deleteMany({superadmin: req.params.id})
        await Betsummaries.deleteMany({superadmin: req.params.id})
        await Betsummaryhistories.deleteMany({superadmin: req.params.id})
        let newArray = []
        result.forEach(item => {
          newArray.push(item.user)
        })
        await Branches.updateMany({}, {$unset:{[newArray]: 1}})
        await Basketmarkets.updateMany({}, {$unset:{[newArray]: 1}})
        await Basketinplaymarkets.updateMany({}, {$unset:{[newArray]: 1}})
        await Soccermarkets.updateMany({}, {$unset:{[newArray]: 1}})
        await Soccerinplaymarkets.updateMany({}, {$unset:{[newArray]: 1}})
        res.json({ message: 'Kullanıcı başarıyla silindi' })
      }else{
        await Users.deleteOne({user:req.params.id})
        await Loginlogs.deleteOne({user:req.params.id})
        res.json({code: 200, message: 'Kullanıcı başarıyla silindi' })
      }
    }else{
      return false
    }
}))
router.post('/resetaccount', wrapAsync(async (req, res) => {
  const activecount = await Betsummaries.findOne({user: req.body.userbox, state: 'Aktif'}).exec()
  if (activecount) {
    res.json({ message: 'Aktif kuponunuz var!' })
  } else {
    const ucr = await Users.findOne({user: req.body.userbox}, 'credit creditremain').exec()
    const bsh = await Betsummaries.find({$or: [{user: req.body.userbox}, {admin: req.body.userbox}]}).exec()
    await Betsummaryhistories.insertMany(bsh)
    await Betsummaries.deleteMany({$or: [{user: req.body.userbox}, {admin: req.body.userbox}]})
    const bh = await Bets.find({$or: [{user: req.body.userbox}, {admin: req.body.userbox}]}).exec()
    await Betshistories.insertMany(bh)
    await Bets.deleteMany({$or: [{user: req.body.userbox}, {admin: req.body.userbox}]})
    await Users.updateOne({user: req.body.userbox}, {$set:{resetaccount: Date.now()}})
    if (req.body.role === 'C1') {
      await Users.updateOne({user: req.body.userbox}, {$set:{credit: 0, creditremain: 0}})
      res.json({code: 200, message: 'Hesap sıfırlandı'})  
    }else if (req.body.role === 'G1') {
      await Users.updateOne({user: req.body.userbox}, {$set:{creditremain: req.body.newcredit}})
      res.json({code: 200, message: 'Hesap sıfırlandı'})  
    }else {
      await Users.updateOne({user: req.body.userbox}, {$set: {creditremain: ucr.credit}})
      res.json({code: 200, message: 'Hesap sıfırlandı'})  
    }                      
  }
}))
router.post('/usercomission', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'A2') {
    const usercomission = await Users.findOne({user: req.body.userbox}).exec()
    res.json({ usercomission: usercomission.usercomission })
  }else{
    const usercomission = await Users.findOne({user: req.session.auth.user}).exec()
    res.json({ usercomission: usercomission.usercomission })
  }
}))
router.put('/updateusercomission', wrapAsync(async (req, res) => {
  if (req.body.userbox === 'Üyeler') {
    await Users.updateOne({user:req.session.auth.user},{$set:{usercomission: req.body.usercomission}})
    await Users.updateOne({user:req.session.auth.user, role:'U1'},{$set:{usercomission: req.body.usercomission}})
    res.json({ code: 200 })
  } else {
    await Users.updateOne({user:req.body.user},{$set:{usercomission: req.body.usercomission}})
    res.json({ code: 200 })
  }
}))
router.put('/updatepersoncomission', wrapAsync(async (req, res) => {
  if (req.body.userbox === 'Üyeler') {
    await Users.updateOne({user:req.session.auth.user},{$set:{personcomission: req.body.personcomission}})
    await Users.updateOne({user:req.session.auth.user, role:'U1'},{$set:{personcomission: req.body.personcomission}})
    res.json({ code: 200 })
  } else {
    await Users.updateOne({user:req.body.user},{$set:{personcomission: req.body.personcomission}})
    res.json({ code: 200 })
  }
}))
router.put('/updateusercancelbet', wrapAsync(async (req, res) => {
  if (req.body.userbox === 'Üyeler') {
    await Users.updateOne({user:req.session.auth.user},{$set:{usercancelbet: req.body.usercancelbet}})
    await Users.updateOne({user:req.session.auth.user, role:'U1'},{$set:{usercancelbet: req.body.usercancelbet}})
    res.json({ code: 200 })
  } else {
    await Users.updateOne({user:req.body.user},{$set:{usercancelbet: req.body.usercancelbet}})
    res.json({ code: 200 })
  }
}))
router.put('/updatepersoncancelbet', wrapAsync(async (req, res) => {
  if (req.body.userbox === 'Üyeler') {
    await Users.updateOne({user:req.session.auth.user},{$set:{personcancelbet: req.body.personcancelbet}})
    await Users.updateOne({user:req.session.auth.user, role:'U1'},{$set:{personcancelbet: req.body.personcancelbet}})
    res.json({ code: 200 })
  } else {
    await Users.updateOne({user:req.body.user},{$set:{personcancelbet: req.body.personcancelbet}})
    res.json({ code: 200 })
  }
}))
router.put('/updatecredit/:id', wrapAsync(async (req, res) => {
  let ope = null
  let des = null
  if (req.body.operate === 'arti') {
    await Users.updateOne({user: req.params.id}, {$inc :{credit: + req.body.updateamount, creditremain: + req.body.updateamount}})
    ope = 'Eklendi'
    des = 'Limit Arttırma'
  }else{
    await Users.updateMany({user: req.params.id}, {$inc :{credit: - req.body.updateamount, creditremain: - req.body.updateamount}})
    ope = 'Eksildi'
    des = 'Limit Düşürme'
  }
    const result = await Users.find({user: req.params.id}, 'credit creditremain')
    let creditlogs = new Creditlogs({
      user: req.params.id,
      admin: req.session.auth.user,
      superadmin: req.session.auth.admin,
      date: new Date(),
      amount: req.body.updateamount,
      credit: req.body.credit,
      creditremain: result[0].credit,
      ope: ope,
      des: des
    })
    await creditlogs.save()
    res.json({code: 200})
}))
router.put('/updatecreditremain/:id', wrapAsync(async (req, res) => {
  let ope = null
  let des = null
    if (req.body.operate === 'arti') {
      await Users.updateOne({user: req.params.id}, {$inc:{creditremain: + req.body.updateamount}})
      await Users.updateOne({user: req.session.auth.user}, {$inc:{creditremain: - req.body.updateamount}})
      ope = 'Eklendi'
      des = 'Limit Ekleme'
    }else{
      await Users.updateOne({user: req.params.id}, {$inc:{creditremain: - req.body.updateamount}})
      await Users.updateOne({user: req.session.auth.user}, {$inc:{creditremain: + req.body.updateamount}})
      ope = 'Eksildi'
      des = 'Ödeme'
    }
    const result = await Users.find({user: req.params.id}, 'credit creditremain').limit(1).exec()
    let creditlogs = new Creditlogs({
      user: req.params.id,
      admin: req.session.auth.user,
      superadmin: req.session.auth.admin,
      date: new Date(),
      amount: req.body.updateamount,
      credit: req.body.creditremain,
      creditremain: result[0].creditremain,
      ope: ope,
      des: des
    })
    await creditlogs.save()
    res.json({code: 200})
}))
router.put('/updatestate/:id', wrapAsync(async (req, res) => {
  await Users.updateOne({$or: [{user: req.params.id},{admin: req.params.id},{superadmin: req.params.id}]},{$set:{state: req.body.state}})
  res.json({code: 200})
}))
router.put('/updateuserlimit/:id', wrapAsync(async (req, res) => {
  await Users.updateOne({user: req.params.id},{$set:{userlimit: req.body.newlimit}})
  res.json({code: 200})
}))
router.put('/updatepayment/:id', wrapAsync(async (req, res) => {
  let currentDate = new Date()
  await Users.updateOne({user: req.params.id},{$set:{payment: currentDate}})
  res.json({code: 200})
}))
router.put('/updateprofile', wrapAsync(async (req, res) => {
  const result = await Users.findOne({nick:req.body.nick}).limit(1).exec()
  if (result) {
    res.json({ message: 'Bu nick kullanılmaktadır' })
  }else{
    await Users.updateOne({user: req.session.auth.user},{$set:{nick: req.body.nick}})
    res.json({code: 200})
  }
}))
router.put('/updateautopay', wrapAsync(async (req, res) => {
  await Users.updateOne({user: req.session.auth.user},{$set:{autopay: req.body.autopay}})
  res.json({code: 200})
}))
router.put('/updatelogincount', wrapAsync(async (req, res) => {
  await Users.updateOne({user: req.session.auth.user},{$set:{logincount: req.body.logincount}})
  res.json({code: 200})
}))
router.post('/creditinfo', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'G1' || req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
    const creditinfo = await Users.findOne({user: req.session.auth.user}, 'credit creditremain').exec()
    res.json({ creditinfo: creditinfo})
  } else {
    if (req.body.userbox === 'Üyeler') {
      const creditinfo = await Users.aggregate([
        {$match: {admin: req.session.auth.user}},
        {$group: {_id:null, credit: {$sum: '$credit'},creditremain: {$sum: '$creditremain'}}}])
      res.json({ creditinfo: creditinfo[0]})
    } else {
      const creditinfo = await Users.find({user: req.body.userbox}, 'credit creditremain').exec()
      res.json({ creditinfo: creditinfo[0]})
    }
  }
}))
router.post('/subcredit', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'G1') {
    const subcredit = await Users.aggregate([
      {$match: {admin: req.session.auth.user}},
      {$group: {_id:null ,subcredit: {$sum: '$creditremain'}}}])
    res.json({ subcredit: subcredit[0]})
  }else{
    if (req.body.userbox === 'Üyeler') {
      const subcredit = await Users.aggregate([
        {$match: {superadmin: req.session.auth.user}},
        {$group: {_id:null ,subcredit: {$sum: '$creditremain'}}}])
      res.json({ subcredit: subcredit[0]})
    } else {
      const subcredit = await Users.aggregate([
        {$match: {admin: req.body.userbox}},
        {$group: {_id:null ,subcredit: {$sum: '$creditremain'}}}])
      res.json({ subcredit: subcredit[0]})
    }
  }
}))
router.post('/creditinforeset', wrapAsync(async (req, res) => {
  const creditinfo = await Users.find({user: req.body.userbox}, 'credit creditremain').exec()
  res.json({ creditinfo: creditinfo})
}))
router.post('/creditlogs', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
    const creditlog = await Creditlogs.find({user: req.session.auth.user}).sort({date: -1}).limit(50).exec()
    res.json({ creditlog: creditlog})
  } else {
    const creditlog = await Creditlogs.find({user: req.body.userbox}).sort({date: -1}).limit(50).exec()
    res.json({ creditlog: creditlog})
  }
}))
router.post('/creditlogs/datefilter', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
    const datefilter = await Creditlogs.find({user: req.session.auth.user, date:{$gte: req.body.datestart, $lte: req.body.datefinish}}).sort({date: -1}).exec()
    res.json({ datefilter: datefilter })
  } else{
    const datefilter = await Creditlogs.find({user: req.body.userbox, date:{$gte: req.body.datestart, $lte: req.body.datefinish}}).sort({date: -1}).exec()
    res.json({ datefilter: datefilter })
  }
}))
router.post('/loginlogs', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
    const loginlog = await Loginlogs.find({user: req.session.auth.user}).sort({date: -1}).limit(50).exec()
    res.json({ loginlog: loginlog})
  } else {
    if (req.body.userbox === 'Üyeler') {
      const loginlog = await Loginlogs.find({user: req.session.auth.user}).sort({date: -1}).limit(50).exec()
      res.json({ loginlog: loginlog})
    } else {
      const loginlog = await Loginlogs.find({user: req.body.userbox}).sort({date: -1}).limit(50).exec()
      res.json({ loginlog: loginlog})
    }
  }
}))
router.post('/loginlogs/datefilter', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
    const datefilter = await Loginlogs.find({user: req.session.auth.user, date:{$gte: req.body.datestart, $lte: req.body.datefinish}}).sort({date: -1}).exec()
    res.json({ datefilter: datefilter })
  } else{
    const datefilter = await Loginlogs.find({user: req.body.userbox, date:{$gte: req.body.datestart, $lte: req.body.datefinish}}).sort({date: -1}).exec()
    res.json({ datefilter: datefilter })
  }
}))
module.exports = router