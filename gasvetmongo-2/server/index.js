const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const cors = require('cors')
const server = require('http').createServer(app)
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const Messages = require('../api/models/schemas/messagesSC')

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
let activeusers = {}
let openedusers = []
io.on('connection', (socket) => {
  socket.on('activeusers', (data) => {
    socket.user = data
    activeusers[socket.user] = socket
  })
  socket.on('openedusers', (data) => {
    if(openedusers.indexOf(data) === -1) {
      openedusers.push(data)
    }
  })
  socket.on('selectedusers', (data) => {
    selectedusers = data
  })
  let selectedusers = ''
  socket.on('send message', (data) => {
    if (selectedusers in activeusers) {
      if (openedusers.includes(selectedusers)) {
        activeusers[socket.user].emit('new message', {data: data, onlinestate: true})
        activeusers[selectedusers].emit('new message', {data: data})
        readState = 'yes'
      }else{
        if(selectedusers.length > 0){
          activeusers[socket.user].emit('new message', {data: data, onlinestate: false})
          activeusers[selectedusers].emit('msgcount')
          readState = 'no'
        }
      }
    } else {
      activeusers[socket.user].emit('new message', {data: data, onlinestate: false})
      readState = 'no'
    }
    const messages = new Messages({
      user: data.user,
      betweenmsg: data.sender +'-'+ data.receiver,
      sender: data.sender,
      receiver: data.receiver,
      msg: data.message,
      readed: readState,
    })
    messages.save()
  })
  socket.on('settyping', (data) => {
    if (selectedusers in activeusers) {
      if (openedusers.includes(selectedusers)) {
        activeusers[selectedusers].emit('gettyping', {data:data})
      }
    }
  })
  socket.on('closedusers', (data) => {
    let index = openedusers.indexOf(data)
    openedusers.splice(index, 1)
  })
  socket.on('disconnect', () => {
    if(!socket.user) return
    delete activeusers[socket.user]
  })
  socket.on('betinfo', () => {
    socket.broadcast.emit('returnbetinfo')
  })
})
}
start()
