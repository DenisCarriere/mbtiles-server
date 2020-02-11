const fs = require('fs')
const http = require('http')
const https = require('https')
const path = require('path')
const Conf = require('conf')
const mkdirp = require('mkdirp')
const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const { EventEmitter } = require('events')
const DEFAULT = require('./config')

/**
 * Start Server
 *
 * @param {string} [options] Server Options
 * @param {string} [options.cache='~/mbtiles'] CACHE file path
 * @param {string} [options.protocol='http'] URL Protocol
 * @param {string} [options.domain='localhost'] URL Domain
 * @param {number} [options.port=5000] URL Port
 * @param {boolean} [options.watch=false] Watch files and restarts the server when detected
 * @returns {EventEmitter} EventEmitter
 * @example
 * server({cache: '/Users/mac/mbtiles', port: 5000, verbose: true})
 */
module.exports = function (options = {}) {
  const config = new Conf({ projectName: 'MBTiles Server' })
  config.set('PROTOCOL', options.protocol || DEFAULT.PROTOCOL)
  config.set('PORT', options.port || DEFAULT.PORT)
  config.set('DOMAIN', options.domain || DEFAULT.DOMAIN)
  config.set('CACHE', options.cache || DEFAULT.CACHE)

  // Settings
  const app = express()
  app.use(bodyParser.json())
  app.set('json spaces', 2)
  app.use(bodyParser.urlencoded({ extended: true }))
  app.set('trust proxy', true)

  /**
   * Server
   */
  class Server extends EventEmitter {
    /**
     * Start Server
     *
     * @param {string} [options] Server Options
     * @param {string} [options.cache=~/mbtiles] CACHE file path
     * @param {string} [options.domain='localhost'] URL Domain
     * @param {string} [options.port=5000] URL Port
     * @returns {Promise<Object>} port
     */
    start (options = {}) {
      const protocol = options.protocol || DEFAULT.PROTOCOL
      const port = options.port || DEFAULT.PORT
      const domain = options.domain || DEFAULT.DOMAIN
      const cache = options.cache || DEFAULT.CACHE
      const ssl_key = options.ssl_key || DEFAULT.SSL_KEY
      const ssl_cert = options.ssl_cert || DEFAULT.SSL_CERT
      const watch = options.watch
      options = { protocol, port, domain, cache, watch }

      // Save local settings
      config.set('PROTOCOL', protocol)
      config.set('PORT', port)
      config.set('DOMAIN', domain)
      config.set('CACHE', cache)
      this.cache = cache
      this.watch = watch

      // Create folder
      if (!fs.existsSync(cache)) mkdirp.sync(cache)

      // Restart if file change detected
      if (watch) {
        fs.watchFile(cache, current => {
          this.restart(options)
        })
      }

      return new Promise((resolve, reject) => {
        let server = null;
        if(protocol == "http"){
          server = http.createServer(app)
        }else{
          var options = {
            key:  fs.readFileSync(ssl_key,  'utf8'),
            cert: fs.readFileSync(ssl_cert, 'utf8')
          }
          server = https.createServer(options, app)
        }
        this.server = server.listen(port, () => {
          this.emit('start', options)
          return resolve(options)
        })
        this.server.on('error', error => {
          return reject(error)
        })
      })
    }

    /**
     * Shutdown Server
     *
     * @returns {Promise<void>}
     */
    close () {
      return new Promise(resolve => {
        if (!this.server) return resolve()
        this.server.close(() => {
          this.emit('end')
          this.server = undefined
          if (this.watch) fs.unwatchFile(this.cache)
          return resolve()
        })
      })
    }

    /**
     * Restart Server
     *
     * @param {string} [options] Server Options
     * @param {string} [options.cache=~/mbtiles] CACHE file path
     * @param {string} [options.protocol='http'] URL Protocol
     * @param {string} [options.domain='localhost'] URL Domain
     * @param {string} [options.port=5000] URL Port
     * @returns {Promise<Object>} options
     */
    restart (options = {}) {
      return new Promise(resolve => {
        this.close().then(() => {
          this.start(options).then(options => {
            return resolve(options)
          })
        })
      })
    }
  }
  const ee = new Server()

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
    ee.emit('log', log)
    next()
  })

  // Register Routes
  const routes = require('./routes')
  app.use(favicon(path.join(__dirname, 'public', 'icon.ico')))
  app.use(routes.permissions)
  app.use('/', routes.api)
  app.use('/', routes.mbtiles)
  app.use('/', routes.wmts)

  // Auto-start server
  ee.start(options)
    .catch(error => ee.emit('error', error))
  return ee
}
