const mongoose = require('mongoose')
const Schema = mongoose.Schema

const anonsSC = new Schema({
  anons:{type: String, required: true}
})

module.exports = mongoose.model('anons', anonsSC)