const mongoose = require('mongoose')

const creditlogSC = new mongoose.Schema({
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