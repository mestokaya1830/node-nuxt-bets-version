const mongoose = require('mongoose')

const soccerfixturesSC = new mongoose.Schema({
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
  over:{type: String},
  yes:{type: String},
  no:{type: String}
})

module.exports = mongoose.model('soccerfixtures', soccerfixturesSC)