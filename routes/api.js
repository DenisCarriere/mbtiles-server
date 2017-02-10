const router = require('express').Router()
const CACHE = require('../').CACHE
const PORT = require('../').PORT
const getFiles = require('../utils').getFiles

/**
 * Route for API
 */
router.route('/')
  .all((req, res) => {
    res.json({
      api: `MBTiles Server ${require('../package.json').version}`,
      http: {
        GET: [
          '/<mbtiles>',
          '/<mbtiles>/{zoom}/{x}/{y}',
          '/<mbtiles>/WMTS',
          '/<mbtiles>/WMTS/1.0.0/WMTSCapabilities.xml'
        ]
      },
      mbtiles: getFiles(CACHE, /\.mbtiles$/),
      ok: true,
      cache: CACHE,
      port: PORT,
      status: 200
    })
  })
module.exports = router

