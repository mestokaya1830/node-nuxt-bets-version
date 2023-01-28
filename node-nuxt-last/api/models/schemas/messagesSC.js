const mongoose = require('mongoose')

const messagesSC = new mongoose.Schema({
  user:{type: String, required: true},
  betweenmsg:{type: String, required: true},
  sender:{type: String, required: true},
  receiver:{type: String, required: true},
  msg:{type: String, required: true},
  type:{type: String, required: true},
  date:{type: Date, required: true, default: Date.now()},
  readed:{type: String, required: true}
})

module.exports = mongoose.model('messages', messagesSC)