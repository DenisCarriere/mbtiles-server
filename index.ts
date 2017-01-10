import * as path from 'path'
import * as os from 'os'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as routes from './routes'
import { Request, Response } from 'express'

// Global Variables
export let PROTOCOL: string
export let DOMAIN: string
export let URI: string
export let PORT: number
export let VERBOSE: boolean

interface StartOptions {
  protocol?: string
  domain?: string
  port?: number
  verbose?: boolean
}

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
export function start(uri?: string, options: StartOptions = {}) {
  URI = uri || path.join(os.homedir(), 'mbtiles')
  PROTOCOL = options.protocol || 'http'
  DOMAIN = options.domain || 'localhost'
  PORT = options.port || 5000
  VERBOSE = options.verbose

  // Settings
  const app = express()
  app.use(bodyParser.json())
  app.set('json spaces', 2)
  app.use(bodyParser.urlencoded({ extended: true }))
  app.set('trust proxy', true)

  // Logging Middleware
  app.use((req: Request, res: Response, next: any) => {
    const log = {
      body: req.body,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      method: req.method,
      url: req.originalUrl,
      query: req.query,
      params: req.params,
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
  if (VERBOSE) { process.stdout.write(`Listening on PORT ${ PORT }`) }
}

export default { start }
