const router = require('express').Router()
const PROTOCOL = require('.').PROTOCOL
const DOMAIN = require('.').DOMAIN
const URI = require('.').URI
const PORT = require('.').PORT
const getFiles = require('../utils').getFiles
const wmts = require('wmts')

function WMTSCapabilities (req, res) {
  const service = req.params.mbtiles

  // Check if Service exists
  if (getFiles(URI, /\.mbtiles$/).indexOf(service) === -1) {
    return res.json({
      message: service + ' service is not found',
      ok: false,
      status: 500,
      url: req.url
    })
  }

  // Return XML
  const capabilities = wmts.getCapabilities({
    uri: `${PROTOCOL}://${DOMAIN}:${PORT}/${service}/WMTS`,
    title: service,
    minZoom: 1
  })
  res.set('Content-Type', 'text/xml')
  res.send(capabilities)
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
