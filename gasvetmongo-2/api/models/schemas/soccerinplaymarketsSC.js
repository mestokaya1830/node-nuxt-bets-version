const mongoose = require('mongoose')
const Schema = mongoose.Schema

const soccerinplaymarketsSC = new Schema({
  mid:{type: Number, required: true},
  mn:{type: String, required: true}
}, {strict: false})

module.exports = mongoose.model('soccerinplaymarkets', soccerinplaymarketsSC)