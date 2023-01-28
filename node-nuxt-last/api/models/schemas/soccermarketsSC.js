const mongoose = require('mongoose')

const soccermarketsSC = new mongoose.Schema({
  mid:{type: Number, required: true},
  mn:{type: String, required: true}
}, {strict: false})

module.exports = mongoose.model('soccermarkets', soccermarketsSC)