const mongoose = require('mongoose')
const Schema = mongoose.Schema

const betsSC = new Schema(
  [
    {
    betid:{type: Number, required: true, default: 0},
    sumid:{type: Number, required: true, default: 0},
    code:{type: Number, required: true},
    user:{type: String, required: true},
    admin:{type: String, required: true},
    superadmin:{type: String, required: true},
    matches:{type: String, required: true},
    games:{type: String, required: true},
    options:{type: String, required: true},
    rate:{type: Number, required: true},
    state:{type: String, required: true},
    stream:{type: String, required: true},
    date:{type: Date, required: true, default: Date.now()},
    scoreid:{type: Number, required: true},
    eventtime:{type: String, required: true},
    score:{type: String}
    }
  ]
)

module.exports = mongoose.model('bets', betsSC)