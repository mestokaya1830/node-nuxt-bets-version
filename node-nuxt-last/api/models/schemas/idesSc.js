const mongoose = require('mongoose')

const idesSC = new mongoose.Schema({
  betid:{type: Number, required: true, default: 1},
  sumid:{type: Number, required: true, default: 1}
})

module.exports = mongoose.model('ides', idesSC)