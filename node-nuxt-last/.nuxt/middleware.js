const middleware = {}

middleware['cacheMiddleware'] = require('../middleware/cacheMiddleware.js')
middleware['cacheMiddleware'] = middleware['cacheMiddleware'].default || middleware['cacheMiddleware']

middleware['clientauth'] = require('../middleware/clientauth.js')
middleware['clientauth'] = middleware['clientauth'].default || middleware['clientauth']

middleware['serverauth'] = require('../middleware/serverauth.js')
middleware['serverauth'] = middleware['serverauth'].default || middleware['serverauth']

middleware['wrapasync'] = require('../middleware/wrapasync.js')
middleware['wrapasync'] = middleware['wrapasync'].default || middleware['wrapasync']

export default middleware
