const fs = require('fs')
const URI = require('..').URI

function getFiles (uri = URI, regex = /\.mbtiles$/) {
  let mbtiles = fs.readdirSync(uri).filter(value => value.match(regex))
  mbtiles = mbtiles.map(data => data.replace(regex, ''))
  mbtiles = mbtiles.filter(name => !name.match(/^_.*/))
  return mbtiles
}
module.exports.getFiles = getFiles
