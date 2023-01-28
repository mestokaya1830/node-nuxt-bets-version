const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const wrapAsync = require('../../../middleware/wrapasync')
const Users = require('../schemas/usersSC')
const Messages = require('../schemas/messagesSC')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
});
const fileFilter = function(req, file, cb){
  const types = ['image/jpeg','image/jpg','image/png','image/gif']
  if(!types.includes(file.mimetype)){
    return cb(new Error('Wrong file type'), false)
  }
  cb(null, true)
}
const upload = multer({
  storage,
  fileFilter
})
const uploadAudio = multer({
  storage
})

router.get("/chat", wrapAsync(async (req, res) => {
  const chatuser = await Users.find({ $or: [{ user: req.session.auth.admin }, { admin: req.session.auth.user }] }, 'user admin logincheck')
  const useraaray = chatuser.map(item => item.user)
  const chatcount = await Messages.aggregate([
    { $match: { sender: { $in: useraaray }, receiver: req.session.auth.user, readed: 'no' } },
    { $group: { _id: "$user", count: { $sum: 1 } } }
  ])
  if (chatcount == '') {
    res.json({ chatuser: chatuser })
  } else {
    const final = chatuser.map(item => {
      return {
        user: item.user,
        logincheck: item.logincheck,
        count: chatcount.filter(item2 => {
          if (item2._id === item.user) {
            return item2.count
          } else {
            return 0
          }
        })
      }
    })
    res.json({ chatuser: final })
  }
}))
router.post("/getmsg", wrapAsync(async (req, res) => {
  const sender = req.body.sender + "-" + req.body.receiver
  const receiver = req.body.receiver + "-" + req.body.sender
  const getmsg = await Messages.find({ $or: [{ betweenmsg: sender }, { betweenmsg: receiver }] }, 'msg date sender receiver readed type')
  res.json({ getmsg: getmsg })
}))
router.post("/deletemsgall", wrapAsync(async (req, res) => {
  const sender = req.body.sender + "-" + req.body.receiver
  const receiver = req.body.receiver + "-" + req.body.sender
  const query = { $or: [{ betweenmsg: sender }, { betweenmsg: receiver }] }
  const selectFiles = await Messages.find(query)
  
  for (const item of selectFiles) {
    const path = 'static/uploads/' + item.msg
    if (fs.existsSync(path)) {
      fs.unlinkSync(path)
    }
  }
  await Messages.deleteMany(query)
  res.json({ message: "Mesajlar başarıyla silindi" })
}))
router.put("/updatemsg", wrapAsync(async (req, res) => {
  await Messages.updateMany({ sender: req.body.sender, receiver: req.session.auth.user }, { $set: { readed: "yes" } })
  res.json({ status: 'Done' })
}))
router.get("/msgcount", wrapAsync(async (req, res) => {
  const result = await Messages.aggregate([
    { $match: { receiver: req.session.auth.user, readed: 'no' } },
    { $group: { _id: null, count: { $sum: 1 } } }
  ])
  if (result.length > 0) {
    res.json({ message: result[0].count })
  } else {
    res.json({ message: 'null' })
  }
}))
router.post("/addimage", upload.single('file'), wrapAsync(async(req, res) => {
  res.status(200).json({message:'success'})
}))
router.post("/addaudio", uploadAudio.single('file'),wrapAsync(async(req, res) => {
  res.status(200).json({message:'success'})
}))
module.exports = router