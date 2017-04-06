const path = require('path')
const os = require('os')

const DEFAULT = {
  PROTOCOL: 'http',
  DOMAIN: '127.0.0.1',
  PORT: 5000,
  CACHE: path.join(os.homedir(), 'mbtiles'),
  VERBOSE: false
}

module.exports = DEFAULT
