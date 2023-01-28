const mongoose = require('mongoose')
const Schema = mongoose.Schema

const creditlogSC = new Schema({
  user:{type: String, required: true},
  admin:{type: String, required: true},
  superadmin:{type: String, required: true},
  date:{type: Date, required: true, default: Date.now()},
  amount:{type: Number, required: true},
  credit:{type: Number, required: true},
  creditremain:{type: Number, required: true},
  ope:{type: String, required: true},
  des:{type: String, required: true}
})

module.exports = mongoose.model('creditlogs', creditlogSC)