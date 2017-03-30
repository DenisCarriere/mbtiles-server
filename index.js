const bodyParser = require('body-parser')
const express = require('express')
const utils = require('./utils')
const DEFAULT = require('./config')

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
  const Conf = require('conf')
  const config = new Conf()
  const CACHE = options.cache || DEFAULT.CACHE
  const PROTOCOL = options.protocol || DEFAULT.PROTOCOL
  const PORT = options.port || DEFAULT.PORT
  const DOMAIN = options.domain || DEFAULT.DOMAIN
  const VERBOSE = options.verbose || DEFAULT.VERBOSE

  config.set('PROTOCOL', PROTOCOL)
  config.set('DOMAIN', DOMAIN)
  config.set('PORT', PORT)
  config.set('CACHE', CACHE)
  config.set('VERBOSE', VERBOSE)

  console.log('index cache', CACHE)
  console.log('index port', PORT)

  // Create folder
  utils.createFolders(CACHE)

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
  const routes = require('./routes')
  app.use(routes.permissions)
  app.use('/', routes.api)
  app.use('/', routes.mbtiles)
  app.use('/', routes.wmts)

  // Start Listening
  app.listen(PORT)
  if (VERBOSE) { process.stdout.write('Listening on PORT ' + PORT) }
}
module.exports.start = start
