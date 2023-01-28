const mongoose = require('mongoose')
const Schema = mongoose.Schema

const idesSC = new Schema({
  betid:{type: Number, required: true, default: 0},
  sumid:{type: Number, required: true, default: 0}
})

module.exports = mongoose.model('ides', idesSC)