const mongoose = require('mongoose')
const Schema = mongoose.Schema

const soccermarketsSC = new Schema({
  mid:{type: Number, required: true},
  mn:{type: String, required: true}
}, {strict: false})

module.exports = mongoose.model('soccermarkets', soccermarketsSC)