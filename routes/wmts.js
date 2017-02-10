const path = require('path')
const router = require('express').Router()
const MBTiles = require('mbtiles-offline')
const wmts = require('wmts')
const getFiles = require('../utils').getFiles
const config = require('../config')
const CACHE = config.CACHE
const PROTOCOL = config.PROTOCOL
const DOMAIN = config.DOMAIN
const PORT = config.PORT

function WMTSCapabilities (req, res) {
  const service = req.params.mbtiles
  const mbtiles = new MBTiles(path.join(CACHE, service + '.mbtiles'))

  // Check if Service exists
  if (getFiles(CACHE, /\.mbtiles$/).indexOf(service) === -1) {
    return res.json({
      message: service + ' service is not found',
      ok: false,
      status: 500,
      url: req.url
    })
  }

  // Return XML
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
    res.send(xml)
  })
}

/**
 * Route for RESTFul WMTS Capabilities
 */
router.route('/:mbtiles/WMTS/1.0.0/WMTSCapabilities.xml')
  .get(WMTSCapabilities)

/**
 * Route for KVP WMTS
 */
router.route('/:mbtiles/WMTS')
  .get(WMTSCapabilities)

module.exports = router
