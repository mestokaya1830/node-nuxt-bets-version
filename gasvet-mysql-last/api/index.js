const express = require('express')
const app = express()
const authrouters = require('./models/authRouters')
const userrouters = require('./models/userRouters')
const apirouters = require('./models/apiRouters')
const betrouters = require('./models/betRouters')
const apiroutersdb = require('./models/apiRoutersDb')
const chatrouters = require('./models/chatRouters')
const settingsrouters = require('./models/settingsRouters')
const serverauth = require('../middleware/serverauth')

app.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})
// Create express router
app.use('/', authrouters)
app.use('/home', apirouters)
app.use('/home', serverauth, chatrouters)
app.use('/home/account', serverauth, apiroutersdb)
app.use('/home/account', serverauth, userrouters)
app.use('/home/account', serverauth, betrouters)
app.use('/home/account', serverauth, settingsrouters)


app.use(function(error, req, res, next) {
  res.json({ error: error })
})

// Export the server middleware
export default {
  path: '/api',
  handler: app
}