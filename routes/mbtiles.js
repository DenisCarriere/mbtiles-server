const path = require('path')
const mercator = require('global-mercator')
const router = require('express').Router()
const CACHE = require('../config').CACHE
const getFiles = require('../utils').getFiles
const MBTiles = require('mbtiles-offline')
const tiletype = require('@mapbox/tiletype')

/**
 * Route MBTiles Metadata
 */
router.route('/:mbtiles')
  .get((req, res) => {
    const service = req.params.mbtiles

    // Check if Service exists
    if (getFiles(CACHE, /\.mbtiles$/).indexOf(service) === -1) {
      return res.json({
        message: service + 'service is not found',
        ok: false,
        status: 500,
        url: req.url
      })
    }
    // Fetch tile from local MBTiles
    const mbtiles = new MBTiles(path.join(CACHE, service + '.mbtiles'))
    mbtiles.metadata().then(metadata => {
      res.json(metadata)
    })
  })

/**
 * Route for Single Tile Fetch
 */
router.route('/:mbtiles/:z(\\d+)/:x(\\d+)/:y(\\d+):ext(.jpg|.png|.jpeg|)')
  .get(GetTile)
router.route('/:mbtiles/WMTS/tile/1.0.0/:mbtiles/:Style/:TileMatrixSet/:z(\\d+)/:y(\\d+)/:x(\\d+):ext(.jpg|.png|.jpeg|)')
  .get(GetTile)
router.route('/:mbtiles/WMTS/tile/1.0.0/')
  .get(GetTile)

function GetTile (req, res) {
  const service = req.params.mbtiles
  const x = Number(req.params.x || req.query.TILECOL)
  const y = Number(req.params.y || req.query.TILEROW)
  const z = Number(req.params.z || req.query.TILEMATRIX)
  const tms = [x, y, z]
  let tile

  // Check if Service exists
  if (getFiles(CACHE, /\.mbtiles$/).indexOf(service) === -1) {
    return res.json({
      message: `[${service}] service is not found`,
      ok: false,
      status: 500,
      url: req.url
    })
  }

  // Check if tile is valid
  try {
    tile = mercator.tileToGoogle(tms)
  } catch (e) {
    res.json({
      message: e.message,
      ok: false,
      status: 500,
      url: req.url
    })
  }
  // Fetch tile from local MBTiles
  const mbtiles = new MBTiles(path.join(CACHE, service + '.mbtiles'))
  mbtiles.findOne(tile)
    .then(data => {
      if (data === undefined) {
        return res.json({
          message: 'Tile not found',
          ok: false,
          status: 404,
          url: req.url
        })
      }
      res.set(tiletype.headers(data))
      res.end(data, 'binary')
    })
}

module.exports = router
