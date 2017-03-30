const bodyParser = require('body-parser')
const express = require('express')
const routes = require('./routes')
const utils = require('./utils')
require('./config')
const Conf = require('conf')
const config = new Conf()

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
  const CACHE = options.cache || config.get('CACHE')
  const PROTOCOL = options.protocol || config.get('PROTOCOL')
  const DOMAIN = options.domain || config.get('DOMAIN')
  const PORT = options.port || config.get('PORT')
  const VERBOSE = options.verbose || config.get('VERBOSE')

  config.set('PROTOCOL', PROTOCOL)
  config.set('DOMAIN', DOMAIN)
  config.set('PORT', PORT)
  config.set('CACHE', CACHE)
  config.set('VERBOSE', VERBOSE)

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
  app.use(routes.permissions)
  app.use('/', routes.api)
  app.use('/', routes.mbtiles)
  app.use('/', routes.wmts)

  // Start Listening
  app.listen(PORT)
  if (VERBOSE) { process.stdout.write('Listening on PORT ' + PORT) }
}
module.exports.start = start
