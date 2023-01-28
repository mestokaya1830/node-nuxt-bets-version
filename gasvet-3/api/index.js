const express = require('express')
const app = express()
const serverauth = require('../middleware/serverauth')

app.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})
// Create express router
app.use('/', require('./models/authRouters'))
app.use('/home', require('./models/apiRouters'))
app.use('/home', serverauth, require('./models/chatRouters'))
app.use('/home/account', serverauth, require('./models/apiRoutersDb'))
app.use('/home/account', serverauth, require('./models/userRouters'))
app.use('/home/account', serverauth, require('./models/betRouters'))
app.use('/home/account', serverauth, require('./models/settingsRouters'))

//for db and other errors
app.use(function(error, req, res, next) {
  res.json({ error: error })
})

// Export the server middleware
export default {
  path: '/api',
  handler: app
}