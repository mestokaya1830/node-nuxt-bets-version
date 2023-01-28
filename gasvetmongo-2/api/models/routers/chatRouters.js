const express = require('express')
const router = express.Router()
const wrapAsync = require('../../../middleware/wrapasync')
const Users = require('../schemas/usersSC')
const Messages = require('../schemas/messagesSC')
router.get("/chat", wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'U1' || req.session.auth.role === 'C1') {
    const chatuser = await Users.find({user: req.session.auth.admin}, 'user logincheck').exec()
    const chatcount = await Messages.aggregate([
      {$match:{sender: chatuser[0].user, receiver: req.session.auth.user, readed: 'no'}},
      {$group: {_id: null, count: {$sum: 1}}}
    ])
    if (chatcount == '') {
      res.json({ chatuser: chatuser })
    } else {
      let final = chatuser.map(item =>{
        return{
          user:item.user,
          logincheck:item.logincheck,
          count:chatcount.filter(item2 => {
            if(item2._id === item.user){
              return item2.count
            }else {return 0}
          })
        }
      })
      res.json({ chatuser: final })
    }
  } else {
    const chatuser = await Users.find({$or: [{user: req.session.auth.admin},{admin: req.session.auth.user}]}, 'user admin logincheck').exec()
    let useraaray = chatuser.map(item => item.user)
    const chatcount = await Messages.aggregate([
      {$match:{sender: {$in:useraaray}, receiver: req.session.auth.user, readed: 'no'}},
      {$group: {_id: "$user", count: {$sum: 1}}}
    ])
    if (chatcount == '') {
      res.json({ chatuser: chatuser })
    } else {
      let final = chatuser.map(item =>{
        return{
          user:item.user,
          logincheck:item.logincheck,
          count:chatcount.filter(item2 => {
            if(item2._id === item.user){
              return item2.count
            }else {return 0}
          })
        }
      })
      res.json({ chatuser: final })
    }
  }
}))
router.post("/getmsg", wrapAsync(async (req, res) => {
  let sender = req.body.sender + "-" + req.body.receiver
  let receiver = req.body.receiver + "-" + req.body.sender
  const getmsg = await Messages.find({$or:[{betweenmsg: sender},{betweenmsg: receiver}]}, 'msg date sender receiver readed').exec()
  res.json({ getmsg: getmsg })
}))
router.post("/deletemsg", wrapAsync(async (req, res) => {
  let sender = req.body.sender + "-" + req.body.receiver
  let receiver = req.body.receiver + "-" + req.body.sender
  await Messages.deleteMany({$or:[{betweenmsg: sender},{betweenmsg: receiver}]})
  res.json({ message: "Mesajlar başarıyla silindi" })
}))
router.post("/updatemsg", wrapAsync(async (req, res) => {
  await Messages.updateMany({sender: req.body.sender, receiver: req.session.auth.user}, {$set: {readed: "yes"}})
  res.json({status:'Done'})
}))
router.get("/msgcount", wrapAsync(async (req, res) => {
  const result = await Messages.aggregate([
    {$match: {receiver: req.session.auth.user, readed:'no'}},
    {$group: {_id:null, count:{$sum: 1}}}
  ]).exec()
  if (result.length > 0) {
    res.json({message: result[0].count })
  }else{
    res.json({message:'null'})
  }
}))
module.exports = router