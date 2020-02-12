const os = require('os')
const path = require('path')

const PROTOCOL = process.env.MBTILES_SERVER_PROTOCOL || 'http'
const DOMAIN = process.env.MBTILES_SERVER_DOMAIN || '127.0.0.1'
const PORT = process.env.MBTILES_SERVER_PORT || 5000
const CACHE = process.env.MBTILES_SERVER_CACHE || path.join(os.homedir(), 'mbtiles')
const SSL_KEY = process.env.MBTILES_SERVER_SSL_KEY || path.join(CACHE, 'server.key')
const SSL_CERT = process.env.MBTILES_SERVER_SSL_CERT || path.join(CACHE, 'server.cert')
const VERBOSE = process.env.MBTILES_SERVER_VERBOSE || false

module.exports = {
  PROTOCOL,
  DOMAIN,
  PORT,
  CACHE,
  SSL_KEY,
  SSL_CERT,
  VERBOSE
}
