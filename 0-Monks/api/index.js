const express = require('express')
const app = express()
const routers = require('./models/routers')
const apirouters = require('./models/apiRouters')
const soccerrouters = require('./models/soccerRouters')

app.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})
// Create express router
app.use(routers)
app.use('/home', apirouters)
app.use('/home/account', soccerrouters)

// Export the server middleware
export default {
  path: '/api',
  handler: app
}