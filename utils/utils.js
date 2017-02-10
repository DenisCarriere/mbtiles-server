const CACHE = require('../config').CACHE
const fs = require('fs')

function getFiles (cache = CACHE, regex = /\.mbtiles$/) {
  let mbtiles = fs.readdirSync(cache).filter(value => value.match(regex))
  mbtiles = mbtiles.map(data => data.replace(regex, ''))
  mbtiles = mbtiles.filter(name => !name.match(/^_.*/))
  return mbtiles
}
module.exports.getFiles = getFiles
