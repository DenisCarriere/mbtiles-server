const fs = require('fs')
const path = require('path')
const wmts = require('wmts')
const Conf = require('conf')
const router = require('express').Router()
const MBTiles = require('mbtiles-offline')
const mercator = require('global-mercator')
const tiletype = require('@mapbox/tiletype')
const {mbtilesNotFound, invalidTile, tileNotFound, invalidVersion, invalidService, getQuery, invalidQuery} = require('./utils')
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
  .get(GetCapabilitiesKVP)
router.route('/:mbtiles/WMTS/tile/1.0.0/:mbtiles/:Style/:TileMatrixSet/:z(\\d+)/:y(\\d+)/:x(\\d+):ext(.jpg|.png|.jpeg|)')
  .get(GetTileRESTful)
router.route('/:mbtiles/WMTS/tile/1.0.0')
  .get(GetTileKVP)
router.route('/:mbtiles/:z(\\d+)/:x(\\d+)/:y(\\d+):ext(.jpg|.png|.jpeg|)')
  .get(GetTileRESTful)

function GetCapabilitiesKVP (req, res) {
  const layer = req.params.mbtiles
  const filepath = path.join(CACHE, layer + '.mbtiles')
  const url = req.url

  // const {request, version, service} = getQuery(req)
  const {request} = getQuery(req)
  if (!fs.existsSync(filepath)) return mbtilesNotFound(url, layer, filepath, res)

  const mbtiles = new MBTiles(filepath)
  switch (request) {
    case 'getcapabilities':
      // if (version !== '1.0.0') return invalidVersion(url, layer, filepath, res)
      // if (service !== 'wmts') return invalidService(url, layer, filepath, 'wmts', res)
      return mbtilesMedataToXML(mbtiles, layer, res)
    case undefined:
      return mbtilesMedataToXML(mbtiles, layer, res)
  }
  return GetTileKVP(req, res)
}

/**
 * GetCapabilities RESTful
 *
 * @param {Request} req
 * @param {Response} res
 */
function GetCapabilitiesRESTful (req, res) {
  const layer = req.params.mbtiles
  const filepath = path.join(CACHE, layer + '.mbtiles')
  const {url} = req

  if (!fs.existsSync(filepath)) return mbtilesNotFound(url, layer, filepath, res)

  const mbtiles = new MBTiles(filepath)
  return mbtilesMedataToXML(mbtiles, layer, res)
}

/**
 * GetTile KVP
 *
 * @param {Request} req
 * @param {Response} res
 * @example
 * // http://localhost:5000/default/wmts?request=GetTile&version=1.0.0&service=wmts&tilecol=0&tilerow=0&tilematrix=0
 */
function GetTileKVP (req, res) {
  const layer = req.params.mbtiles
  const {tilecol, tilerow, tilematrix, request, version, service} = getQuery(req)
  const x = Number(tilecol)
  const y = Number(tilerow)
  const z = Number(tilematrix)
  const tms = [x, y, z]
  const url = req.url
  const filepath = path.join(CACHE, layer + '.mbtiles')

  switch (request) {
    case 'gettile':
      // validation
      if (version !== '1.0.0') return invalidVersion(url, layer, filepath, res)
      if (service !== 'wmts') return invalidService(url, layer, filepath, 'wmts', res)
      if (tilecol === undefined) return invalidQuery(url, layer, filepath, 'tilecol', res)
      if (tilerow === undefined) return invalidQuery(url, layer, filepath, 'tilerow', res)
      if (tilematrix === undefined) return invalidQuery(url, layer, filepath, 'tilematrix', res)
      if (!fs.existsSync(filepath)) return mbtilesNotFound(url, layer, filepath, res)
      if (!mercator.validTile(tms)) return invalidTile(url, layer, tms, res)

      const tile = mercator.tileToGoogle(tms)
      const mbtiles = MBTILES.get(layer)
      return mbtiles.findOne(tile)
        .then(data => {
          if (data === undefined) return tileNotFound(url, layer, tms, res)
          res.set(tiletype.headers(data))
          return res.end(data, 'binary')
        })
  }
}

/**
 * GetTile RESTful
 *
 * @param {Request} req
 * @param {Response} res
 */
function GetTileRESTful (req, res) {
  const layer = req.params.mbtiles
  const x = Number(req.params.x || req.query.TILECOL)
  const y = Number(req.params.y || req.query.TILEROW)
  const z = Number(req.params.z || req.query.TILEMATRIX)
  const tms = [x, y, z]
  const url = req.url
  const filepath = path.join(CACHE, layer + '.mbtiles')

  if (!fs.existsSync(filepath)) return mbtilesNotFound(url, layer, filepath, res)
  if (!mercator.validTile(tms)) return invalidTile(url, layer, tms, res)

  const tile = mercator.tileToGoogle(tms)
  const mbtiles = MBTILES.get(layer)
  return mbtiles.findOne(tile)
    .then(data => {
      if (data === undefined) return tileNotFound(url, layer, tms, res)
      res.set(tiletype.headers(data))
      return res.end(data, 'binary')
    })
}

/**
 * MBTiles Metadata to XML
 *
 * @param {MBTiles} mbtiles
 * @param {string} layer
 * @param {Response} res
 */
function mbtilesMedataToXML (mbtiles, layer, res) {
  mbtiles.metadata().then(metadata => {
    const xml = wmts.getCapabilities({
      url: `${PROTOCOL}://${DOMAIN}:${PORT}/${layer}/WMTS`,
      title: layer,
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
