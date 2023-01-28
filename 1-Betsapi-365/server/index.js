const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const cors = require('cors')
const server = require('http').createServer(app)
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const io = require('socket.io')(server)
const mysql = require('../api/models/db')
const bodyParser = require('body-parser')

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  const nuxt = new Nuxt(config)
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  // Give nuxt middleware to express
  app.use(cors({credentials: true, origin: true}))
  app.use(bodyParser.json({limit: '10mb'}))
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
  app.use(nuxt.render)
  server.listen(port, host)

let readState = ''
let users = {}
let openedusers = []
io.on('connection', (socket) => {
  socket.on('activeusers', (data) => {
    socket.user = data
    users[socket.user] = socket
  })
  socket.on('selectedusers', (data) => {
    selectedusers = data
  })
  socket.on('openedusers', (data) => {
    if(openedusers.indexOf(data) === -1) {
      openedusers.push(data)
    }
  })
  let selectedusers = ''
  socket.on('send message', (data) => {
    if (selectedusers in users) {
      users[socket.user].emit('new message', {data: data, onlinestate: true})
      users[selectedusers].emit('new message', {data: data})
      readState = 'yes'
    } else {
      users[socket.user].emit('new message', {data: data, onlinestate: false})
      readState = 'no'
    }
    newMsg = {
      user: data.user,
      betweenmsg: data.sender +'-'+ data.receiver,
      sender: data.sender,
      receiver: data.receiver,
      msg: data.message,
      readed: readState,
    }
    mysql.getConnection().then((conn) => {
      conn.query('INSERT INTO messages SET ?', [newMsg], (err) => {
        if (!err) {
          conn.release()
        }
      })
    })
  })
  socket.on('typing', (data) => {
    if (selectedusers in users) {
      users[selectedusers].emit('typing', data)
    }
  })

  socket.on('disconnect', (data) => {
    if(!socket.user) return
    delete users[socket.user]
  })
})
}
start()
