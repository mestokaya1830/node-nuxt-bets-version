const mongoose = require('mongoose')

const settimesSC = new mongoose.Schema({
  user:{type: String, required: true, default: 'tevye'},
  admin:{type: String, required: true, default: 'tevye'},
  ilkcba:{type: Number, required: true, default: 0},
  ilkcbk:{type: Number, required: true, default: 0},
  ikicba:{type: Number, required: true, default: 45},
  ikicbk:{type: Number, required: true, default: 45},
  sk:{type: String, required: true, default: '00:00'},
  sa:{type: String, required: true, default: '00:00'},
  kbs:{type: Number, required: true, default: 12}
})

module.exports = mongoose.model('settimes', settimesSC)