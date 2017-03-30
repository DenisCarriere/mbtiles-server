const router = require('express').Router()
const getFiles = require('../utils').getFiles
const Conf = require('conf')

// Configurations
const config = new Conf()
const CACHE = config.get('CACHE')
const PORT = config.get('PORT')

/**
 * Route for API
 */
router.route('/')
  .all((req, res) => {
    // const CACHE = router.get('CACHE')
    // const PORT = router.get('PORT')

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

