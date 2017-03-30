const path = require('path')
const os = require('os')
const Conf = require('conf')
const config = new Conf()

const DEFAULT = {
  PROTOCOL: 'http',
  DOMAIN: 'localhost',
  PORT: 5000,
  CACHE: path.join(os.homedir(), 'mbtiles'),
  VERBOSE: false
}

const PROTOCOL = config.get('PROTOCOL') || DEFAULT.PROTOCOL
const DOMAIN = config.get('DOMAIN') || DEFAULT.DOMAIN
const PORT = config.get('PORT') || DEFAULT.PORT
const CACHE = config.get('CACHE') || DEFAULT.CACHE
const VERBOSE = config.get('VERBOSE') || DEFAULT.VERBOSE

// Set config store
config.set('PROTOCOL', PROTOCOL)
config.set('DOMAIN', DOMAIN)
config.set('PORT', PORT)
config.set('CACHE', CACHE)
config.set('VERBOSE', VERBOSE)

module.exports = DEFAULT
