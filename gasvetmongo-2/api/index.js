const express = require('express')
const app = express()
const serverauth = require('../middleware/serverauth')
const authrouters = require('./models/routers/authRouters')
const userrouters = require('./models/routers/userRouters')
const settingsrouters = require('./models/routers/settingsRouters')
const apirouters = require('./models/routers/apiRouters')
const betrouters = require('./models/routers/betRouters')
const apiroutersdb = require('./models/routers/apiRoutersDb')
const chatrouters = require('./models/routers/chatRouters')

app.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})
// Create express router
app.use('/', authrouters)
app.use('/home/account', serverauth, userrouters)
app.use('/home/account', serverauth, settingsrouters)
app.use('/home', apirouters)
app.use('/home/account', serverauth, betrouters)
app.use('/home', serverauth, chatrouters)
app.use('/home/account', serverauth, apiroutersdb)


app.use(function(error, req, res, next) {
  res.json({ error: error })
})

// Export the server middleware
export default {
  path: '/api',
  handler: app
}