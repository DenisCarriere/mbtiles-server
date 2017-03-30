const path = require('path')
const os = require('os')

const DEFAULT = {
  PROTOCOL: 'http',
  DOMAIN: 'localhost',
  PORT: 5000,
  CACHE: path.join(os.homedir(), 'mbtiles'),
  VERBOSE: false
}

module.exports = DEFAULT
