const fs = require('fs')
const path = require('path')
const wmts = require('wmts')
const Conf = require('../plugins/conf')
const router = require('express').Router()
const MBTiles = require('mbtiles-offline')
const mercator = require('global-mercator')
const tiletype = require('@mapbox/tiletype')
const {mbtilesNotFound, invalidTile, tileNotFound} = require('./utils')
const {getFiles} = require('../utils')

// Configurations
const config = new Conf()
const PORT = config.get('PORT')
const CACHE = config.get('CACHE')
const DOMAIN = config.get('DOMAIN')
const PROTOCOL = config.get('PROTOCOL')

// Store all MBTiles
const MBTILES = new Map()
console.log('cache', CACHE)
getFiles(CACHE).forEach(service => {
  MBTILES.set(service, new MBTiles(path.join(CACHE, service + '.mbtiles')))
})

/**
 * Routes
 */
router.route('/:mbtiles/WMTS/1.0.0/WMTSCapabilities.xml')
  .get(GetCapabilitiesRESTful)
router.route('/:mbtiles/WMTS')
  .get(GetCapabilitiesRESTful)
router.route('/:mbtiles/WMTS?')
  .get(GetCapabilities)
router.route('/:mbtiles/WMTS/tile/1.0.0/:mbtiles/:Style/:TileMatrixSet/:z(\\d+)/:y(\\d+)/:x(\\d+):ext(.jpg|.png|.jpeg|)')
  .get(GetTile)
router.route('/:mbtiles/WMTS/tile/1.0.0/')
  .get(GetTile)
router.route('/:mbtiles/:z(\\d+)/:x(\\d+)/:y(\\d+):ext(.jpg|.png|.jpeg|)')
  .get(GetTile)

function GetCapabilities (req, res) {
  const service = req.params.mbtiles
  const filepath = path.join(CACHE, service + '.mbtiles')
  const url = req.url
  if (!fs.existsSync(filepath)) return mbtilesNotFound(url, service, filepath, res)

  const mbtiles = new MBTiles(filepath)
  return mbtilesMedataToXML(mbtiles, service, res)
}

/**
 * GetCapabilities RESTful
 *
 * @param {Request} req
 * @param {Response} res
 */
function GetCapabilitiesRESTful (req, res) {
  const service = req.params.mbtiles
  const filepath = path.join(CACHE, service + '.mbtiles')
  const url = req.url

  if (!fs.existsSync(filepath)) return mbtilesNotFound(url, service, filepath, res)

  const mbtiles = new MBTiles(filepath)
  return mbtilesMedataToXML(mbtiles, service, res)
}

/**
 * GetTile
 *
 * @param {Request} req
 * @param {Response} res
 */
function GetTile (req, res) {
  const service = req.params.mbtiles
  const x = Number(req.params.x || req.query.TILECOL)
  const y = Number(req.params.y || req.query.TILEROW)
  const z = Number(req.params.z || req.query.TILEMATRIX)
  const tms = [x, y, z]
  const url = req.url
  const filepath = path.join(CACHE, service + '.mbtiles')

  if (!fs.existsSync(filepath)) return mbtilesNotFound(url, service, filepath, res)
  if (!mercator.validTile(tms)) return invalidTile(url, service, tms, res)

  const tile = mercator.tileToGoogle(tms)
  const mbtiles = MBTILES.get(service)
  return mbtiles.findOne(tile)
    .then(data => {
      if (data === undefined) return tileNotFound(url, service, tms, res)
      res.set(tiletype.headers(data))
      return res.end(data, 'binary')
    })
}

/**
 * MBTiles Metadata to XML
 *
 * @param {MBTiles} mbtiles
 * @param {string} service
 * @param {Response} res
 */
function mbtilesMedataToXML (mbtiles, service, res) {
  mbtiles.metadata().then(metadata => {
    const xml = wmts.getCapabilities({
      url: `${PROTOCOL}://${DOMAIN}:${PORT}/${service}/WMTS`,
      title: service,
      minzoom: metadata.minzoom,
      maxzoom: metadata.maxzoom,
      abstract: metadata.description,
      bbox: metadata.bounds,
      format: metadata.format,
      spaces: 2
    })
    res.set('Content-Type', 'text/xml')
    return res.send(xml)
  })
}

module.exports = router
