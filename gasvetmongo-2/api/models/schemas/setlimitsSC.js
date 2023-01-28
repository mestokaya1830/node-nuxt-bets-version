const mongoose = require('mongoose')
const Schema = mongoose.Schema

const setlimitsSC = new Schema({
  user:{type: String, required: true, default: 'tevye'},
  admin:{type: String, required: true, default: 'tevye'},
  minms:{type: Number, required: true, default: 0},
  maxms:{type: Number, required: true, default: 0},
  minkm:{type: Number, required: true, default: 5},
  maxkm:{type: Number, required: true, default: 1000},
  maxrate:{type: Number, required: true, default: 1000},
  maxearn:{type: Number, required: true, default: 10000},
  cminms:{type: Number, required: true, default: 0},
  cmaxms:{type: Number, required: true, default: 0},
  cminkm:{type: Number, required: true, default: 5},
  cmaxkm:{type: Number, required: true, default: 1000},
  cmaxrate:{type: Number, required: true, default: 1000},
  cmaxearn:{type: Number, required: true, default: 10000}
})

module.exports = mongoose.model('setlimits', setlimitsSC)