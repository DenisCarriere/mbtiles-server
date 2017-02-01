const path = require('path')
const os = require('os')
const bodyParser = require('body-parser')
const express = require('express')
const routes = require('./routes')

// Global Variables
let PROTOCOL = 'http'
let DOMAIN = 'localhost'
let URI = path.join(os.homedir(), 'mbtiles')
let PORT = 5000
let VERBOSE = true
module.exports.PROTOCOL = PROTOCOL
module.exports.DOMAIN = DOMAIN
module.exports.URI = URI
module.exports.PORT = PORT
module.exports.VERBOSE = VERBOSE

/**
 * Start Server
 *
 * @param {string} [uri=~/mbtiles] URI file path
 * @param {string} [options] Server Options
 * @param {string} [options.protocol='http'] URL Protocol
 * @param {string} [options.domain='localhost'] URL Domain
 * @param {string} [options.port=5000] URL Port
 * @param {string} [options.verbose=false] Verbose output
 * @returns {void} System output for logs
 * @example
 * server.start('~/mbtiles', {port: 5000, verbose: true})
 */
function start (uri, options = {}) {
  URI = uri || URI
  PROTOCOL = options.protocol || PROTOCOL
  DOMAIN = options.domain || DOMAIN
  PORT = options.port || PORT
  VERBOSE = options.verbose

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
