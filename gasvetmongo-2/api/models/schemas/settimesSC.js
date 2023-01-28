const mongoose = require('mongoose')
const Schema = mongoose.Schema

const settimesSC = new Schema({
  user:{type: String, required: true, default: 'tevye'},
  admin:{type: String, required: true, default: 'tevye'},
  ilkcba:{type: Number, required: true, default: 0},
  ilkcbk:{type: Number, required: true, default: 0},
  ikicba:{type: Number, required: true, default: 0},
  ikicbk:{type: Number, required: true, default: 0},
  sk:{type: String, required: true, default: '00:00'},
  sa:{type: String, required: true, default: '00:00'}
})

module.exports = mongoose.model('settimes', settimesSC)