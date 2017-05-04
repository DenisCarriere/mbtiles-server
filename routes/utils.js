/**
 * MBTiles not found
 *
 * @param {string} url
 * @param {string} service
 * @param {string} filepath
 * @param {Response} res
 */
function mbtilesNotFound (url, service, filepath, res) {
  return res.status(404).json({
    url,
    service,
    filepath,
    ok: false,
    status: 404,
    statusText: 'service not found'
  })
}

/**
 * Invalid Tile
 *
 * @param {string} url
 * @param {string} service
 * @param {[number, number, number]} tile
 * @param {Response} res
 */
function invalidTile (url, service, tile, res) {
  return res.status(400).json({
    url,
    service,
    tile,
    ok: false,
    status: 400,
    statusText: 'invalid tile'
  })
}

/**
 * Tile not found
 *
 * @param {string} url
 * @param {string} service
 * @param {[number, number, number]} tile
 * @param {Response} res
 */
function tileNotFound (url, service, tile, res) {
  return res.status(404).json({
    url,
    service,
    tile,
    ok: false,
    status: 404,
    statusText: 'tile not found'
  })
}

module.exports = {
  mbtilesNotFound,
  invalidTile,
  tileNotFound
}
