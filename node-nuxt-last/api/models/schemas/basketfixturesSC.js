const mongoose = require('mongoose')

const basketfixturesSC = new mongoose.Schema({
  fixtureid:{type: Number, required: true},
  RegionId:{type: Number, required: true},
  RegionName:{type: String, required: true},
  startdate:{type: Date, required: true},
  leagueid:{type: Number, required: true},
  leaguename:{type: String, required: true},
  HomeTeam:{type: String, required: true},
  AwayTeam:{type: String, required: true},
  home:{type: String, required: true},
  draw:{type: String, required: true},
  away:{type: String, required: true},
  under:{type: String},
  underodds:{type: String},
  over:{type: String},
  overodds:{type: String},
  han1:{type: String},
  han1attr:{type: String},
  han2:{type: String},
  han2attr:{type: String}
})

module.exports = mongoose.model('basketfixtures', basketfixturesSC)