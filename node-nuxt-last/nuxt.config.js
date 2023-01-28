const pkg = require('./package')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)

module.exports = {
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  loading: { 
    color: '#009464',
    failedColor: 'orange'
  },
  css: [
    '~/assets/css/fontawesome-all.min.css',
    '~/assets/css/main.css'
  ],
  components: true,
  
  modules: [
    'nuxt-helmet'
    //...other modules
  ],
  plugins: [
    '~/plugins/socket.io',
    '~/plugins/vue2-filters',
    '~/plugins/vueprint',
    '~/plugins/vuemoment',
    '~/plugins/global.js'
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
    session({
      secret: 'super-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000 },
      httpOnly: true,//only transmit cookie over https
      secure: true,//prevents client side js reading the cookies
      store: new MemoryStore({
        checkPeriod: 86400000
      })
    }),
    '~/api'
  ]
}
