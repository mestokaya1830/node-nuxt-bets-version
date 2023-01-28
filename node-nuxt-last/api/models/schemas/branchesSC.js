const mongoose = require('mongoose')

const branchesSC = new mongoose.Schema({
  bid:{type: Number, required: true},
  bn:{type: String, required: true}
}, { strict: false })

module.exports = mongoose.model('branches', branchesSC)