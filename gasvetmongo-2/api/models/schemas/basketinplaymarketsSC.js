const mongoose = require('mongoose')
const Schema = mongoose.Schema

const basketinplaymarketsSC = new Schema({
  code:{type: Number, required: true},
  mid:{type: Number, required: true},
  mn:{type: String, required: true}
}, {strict: false})

module.exports = mongoose.model('basketinplaymarkets', basketinplaymarketsSC)