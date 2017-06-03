const fs = require('fs')
const {CACHE} = require('../config')

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
  return fs.readdirSync(cache)
    .filter(value => value.match(regex))
    .map(data => data.replace(regex, ''))
    .filter(name => !name.match(/^_.*/))
}

module.exports = {
  getFiles
}
