const fs = require('fs')
const mkdirp = require('mkdirp')
const { CACHE } = require('../config')

/**
 * Get Files
 *
 * @param {string} cache File Path
 * @param {ReGex} regex MBTiles pattern
 * @returns {string[]}
 * getFiles('~/mbtiles')
 * //= ['example', 'foo', 'bar']
 */
function getFiles (cache = CACHE, regex = /\.mbtiles$/) {
  if (!fs.existsSync(cache)) mkdirp.sync(cache)

  return fs.readdirSync(cache)
    .filter(value => value.match(regex))
    .map(data => data.replace(regex, ''))
    .filter(name => !name.match(/^_.*/))
}

module.exports = {
  getFiles
}
