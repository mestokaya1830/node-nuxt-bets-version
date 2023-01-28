const express = require('express')
const app = express()
const routers = require('./models/routers')

// Create express router
app.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

app.use('/', routers)

// Export the server middleware
export default {
  path: '/api',
  handler: app
}