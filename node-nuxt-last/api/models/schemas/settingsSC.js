const mongoose = require('mongoose')

const settingsSC = new mongoose.Schema({
  user:{type: String},
  admin:{type: String},
  type:{type: String},
  operate:{type: String},
  filterid:{type: Number},
  rate:{type: Number}
})

module.exports = mongoose.model('settings', settingsSC)