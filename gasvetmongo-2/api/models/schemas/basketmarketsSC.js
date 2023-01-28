const mongoose = require('mongoose')
const Schema = mongoose.Schema

const basketmarketsSC = new Schema({
  mid:{type: Number, required: true},
  mn:{type: String, required: true}
}, {strict: false})

module.exports = mongoose.model('basketmarkets', basketmarketsSC)