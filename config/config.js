const path = require('path')
const os = require('os')
module.exports.PROTOCOL = 'http'
module.exports.DOMAIN = 'localhost'
module.exports.URI = path.join(os.homedir(), 'mbtiles')
module.exports.PORT = 5000
module.exports.VERBOSE = true
