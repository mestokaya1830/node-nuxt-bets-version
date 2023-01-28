const mongoose = require('mongoose')
const Schema = mongoose.Schema

const settingsSC = new Schema({
  user:{type: String},
  admin:{type: String},
  type:{type: String},
  operate:{type: String},
  filterid:{type: Number},
  rate:{type: Number}
})

module.exports = mongoose.model('settings', settingsSC)