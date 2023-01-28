const pkg = require('./package')
const bodyParser = require('body-parser')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)

module.exports = {
  mode: 'universal',

  head: {
    title: 'gasvet',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1'}
    ],

    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  loading: { 
    color: '#fff'
  },
  css: [
    '~/assets/css/fontawesome-all.min.css',
    '~/assets/css/main.css'
  ],

  plugins: [
    '~/plugins/socket.io',
    '~/plugins/lodash',
    '~/plugins/vue2-filters',
    '~/plugins/vueprint',
    '~/plugins/vuemoment',
    '~/plugins/draggable'
  ],
  build: {
    loaders: {
      vue: {
        transformAssetUrls: {
          audio: 'src'
        }
      }
    },
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      })
    }
  },
  serverMiddleware: [
    bodyParser.json(),
    session({
      secret: 'super-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000 },
      httpOnly: true,
      secure: true,
      store: new MemoryStore({
        checkPeriod: 86400000
      })
    }),
    '~/api'
  ]
}
