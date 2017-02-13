const CACHE = require('../config').CACHE
const fs = require('fs')
const mkdirp = require('mkdirp')
const chalk = require('chalk')

module.exports.getFiles = (cache = CACHE, regex = /\.mbtiles$/) => {
  let mbtiles = fs.readdirSync(cache).filter(value => value.match(regex))
  mbtiles = mbtiles.map(data => data.replace(regex, ''))
  mbtiles = mbtiles.filter(name => !name.match(/^_.*/))
  return mbtiles
}

module.exports.error = (message) => {
  throw new Error(chalk.bgRed.white(message))
}

module.exports.warning = (message) => {
  console.log(chalk.bgYellow.black(message))
}

module.exports.createFolders = (location) => {
  mkdirp(location, () => true)
}
