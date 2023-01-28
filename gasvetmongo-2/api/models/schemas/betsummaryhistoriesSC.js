const mongoose = require('mongoose')
const Schema = mongoose.Schema

const betsummaryhistoriesSC = new Schema({
  user:{type: String, required: true},
  admin:{type: String, required: true},
  superadmin:{type: String, required: true},
  date:{type: Date, required: true, default: Date.now()},
  betscount:{type: Number, required: true},
  betscountremain:{type: Number, required: true},
  amount:{type: Number, required: true},
  rate:{type: Number, required: true},
  earn:{type: Number, required: true},
  baseearn:{type: Number, required: true},
  owner:{type: String, required: true},
  state:{type: String, required: true},
  userpay:{type: String, required: true},
  adminpay:{type: String, required: true},
  stream:{type: String, required: true},
  role:{type: String, required: true},
  woncount:{type: Number, required: true},
  lostcount:{type: Number, required: true}
})

module.exports = mongoose.model('betsummaryhistories', betsummaryhistoriesSC)