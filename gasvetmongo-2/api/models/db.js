const mongoose = require('mongoose')

const db = mongoose.connect('mongodb://localhost/gasvet',{
  useNewUrlParser:true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>{
  console.log('Connected')
}).catch((err)=>{console.log(err)})

module.exports = db
