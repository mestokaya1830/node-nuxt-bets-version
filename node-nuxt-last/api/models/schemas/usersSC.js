const mongoose = require('mongoose')

const usersSC = new mongoose.Schema({
  user:{type: String, required: true, unique: true, trim: true},
  nick:{type: String, required: true, unique: true, trim: true},
  pass:{type: String, required: true, trim: true},
  admin:{type: String, required: true},
  superadmin:{type: String, required: true},
  role:{type: String, required: true},
  credit:{type: Number, default: 0, trim: true},
  creditremain:{type: Number, default: 0},
  userlimit:{type: Number, default: 0},
  usedlimit:{type: Number, default: 0},
  date:{type: Date, default: Date.now},
  state:{type: String, default: 'aktif'},
  payment:{type: Date},
  usercomission:{type: Number, default: 40},
  personcomission:{type: Number, default: 5},
  fakelogin:{type: Number, default: 0},
  logincount:{type: Number, default: 5},
  logincheck:{type: String, default: 'passive'},
  multilogin:{type: Boolean, default: true},
  sessioncount:{type: Number, default: 0},
  resetaccount:{type: Date, default: Date.now},
  autopay:{type: Number, default: 0},
  usercancelbet:{type: Number, default: 15},
  personcancelbet:{type: Number, default: 15}
})

module.exports = mongoose.model('users', usersSC)