const bodyParser = require('body-parser')
const express = require('express')
const config = require('./config')
const routes = require('./routes')

// Global Variables
let PROTOCOL = config.PROTOCOL
let DOMAIN = config.DOMAIN
let CACHE = config.CACHE
let PORT = config.PORT
let VERBOSE = config.VERBOSE

module.exports.PROTOCOL = PROTOCOL
module.exports.DOMAIN = DOMAIN
module.exports.CACHE = CACHE
module.exports.PORT = PORT
module.exports.VERBOSE = VERBOSE

/**
 * Start Server
 *
 * @param {string} [options] Server Options
 * @param {string} [options.cache=~/mbtiles] CACHE file path
 * @param {string} [options.protocol='http'] URL Protocol
 * @param {string} [options.domain='localhost'] URL Domain
 * @param {string} [options.port=5000] URL Port
 * @param {string} [options.verbose=false] Verbose output
 * @returns {void} System output for logs
 * @example
 * server.start({cache: '/Users/mac/mbtiles', port: 5000, verbose: true})
 */
function start (options = {}) {
  CACHE = options.cache || CACHE
  PROTOCOL = options.protocol || PROTOCOL
  DOMAIN = options.domain || DOMAIN
  PORT = options.port || PORT
  VERBOSE = options.verbose || VERBOSE

  // Settings
  const app = express()
  app.use(bodyParser.json())
  app.set('json spaces', 2)
  app.use(bodyParser.urlencoded({ extended: true }))
  app.set('trust proxy', true)

  // Logging Middleware
  app.use((req, res, next) => {
    const log = {
      body: req.body,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      params: req.params
    }
    if (VERBOSE) { process.stdout.write(JSON.stringify(log)) }
    next()
  })

  // Register Routes
  app.use(routes.permissions)
  app.use('/', routes.api)
  app.use('/', routes.mbtiles)
  app.use('/', routes.wmts)

  // Start Listening
  app.listen(PORT)
  if (VERBOSE) { process.stdout.write('Listening on PORT ' + PORT) }
}
module.exports.start = start
