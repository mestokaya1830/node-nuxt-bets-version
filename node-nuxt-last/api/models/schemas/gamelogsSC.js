const mongoose = require('mongoose')

const gamelogsSC = new mongoose.Schema({
  gameid:{type: Number, required: true},
  user:{type: String, required: true},
  admin:{type: String, required: true},
  superadmin:{type: String, required: true},
  date:{type: Date, required: true, default: Date.now()},
  amount:{type: Number, required: true},
  creditremain:{type: Number, required: true},
  ope:{type: String, required: true},
  des:{type: String, required: true}
})

module.exports = mongoose.model('gamelogs', gamelogsSC)