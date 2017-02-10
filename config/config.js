const path = require('path')
const os = require('os')

module.exports.PROTOCOL = process.env.MBTILES_SERVER_PROTOCOL || 'http'
module.exports.DOMAIN = process.env.MBTILES_SERVER_DOMAIN || 'localhost'
module.exports.CACHE = process.env.MBTILES_SERVER_CACHE || path.join(os.homedir(), 'mbtiles')
module.exports.PORT = process.env.MBTILES_SERVER_PORT || 5000
module.exports.VERBOSE = process.env.MBTILES_SERVER_VERBOSE
