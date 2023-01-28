const mongoose = require('mongoose')

const db = mongoose.connect('mongodb://mesto:9090@localhost:27017/gasvet?authSource=admin',{
  useNewUrlParser:true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>{
  console.log('Connected')
}).catch((err)=>{console.log(err)})

module.exports = db
