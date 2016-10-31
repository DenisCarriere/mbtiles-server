import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as routes from './routes'

// Global Variables
export let PROTOCOL: string
export let DOMAIN: string
export let PATH: string
export let PORT: number

/**
 * Start Server
 */
export function start(path: string, protocol = 'http', domain = 'localhost', port = 5000) {
  PROTOCOL = protocol
  DOMAIN = domain
  PATH = path
  PORT = port

  // Settings
  const app = express()
  app.use(bodyParser.json())
  app.set('json spaces', 2)
  app.use(bodyParser.urlencoded({ extended: true }))
  app.set('trust proxy', true)

  // Register Routes
  app.use(routes.permissions)
  app.use('/', routes.api)
  app.use('/', routes.mbtiles)
  app.use('/wmts', routes.wmts)

  // Start Listening
  app.listen(port)
  console.log(`Listening on PORT ${ port }`)
}
