import * as path from 'path'
import * as mercator from 'global-mercator'
import { Router, Request, Response } from 'express'
import { PATH } from '../index'
import { Tile, getFiles, MBTiles } from '../utils'

const router = Router()

interface MBTilesRequest extends Request {
  params: {
    mbtiles: string
    x: string
    y: string
    z: string
    ext: string
  }
}

/**
 * Route MBTiles Metadata
 */
router.route('/:mbtiles')
  .get(async (req: MBTilesRequest, res: Response) => {
    const service = req.params.mbtiles

    // Check if Service exists
    if (getFiles(PATH, /\.mbtiles$/).indexOf(service) === -1) {
      return res.json({
        message: `[${ service }] service is not found`,
        ok: false,
        status: 500,
        url: req.url,
      })
    }
    // Fetch tile from local MBTiles
    const mbtiles = new MBTiles(path.join(PATH, `${ service }.mbtiles`))
    const metadata = await mbtiles.metadata()
    res.json(metadata)
  })

/**
 * Route for Single Tile Fetch
 */
router.route('/:mbtiles/:z(\\d+)/:x(\\d+)/:y(\\d+):ext(.jpg|.png|)')
  .get(GetTile)
router.route('/:mbtiles/WMTS/tile/1.0.0/:mbtiles/:Style/:TileMatrixSet/:z(\\d+)/:y(\\d+)/:x(\\d+):ext(.jpg|.png|)')
  .get(GetTile)

function GetTile(req: MBTilesRequest, res: Response) {
  const service = req.params.mbtiles
  const tms = [Number(req.params.x), Number(req.params.y), Number(req.params.z)]
  let tile: Tile

  // Check if Service exists
  if (getFiles(PATH, /\.mbtiles$/).indexOf(service) === -1) {
    return res.json({
      message: `[${ service }] service is not found`,
      ok: false,
      status: 500,
      url: req.url,
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
      url: req.url,
    })
  }
  // Fetch tile from local MBTiles
  const mbtiles = new MBTiles(path.join(PATH, `${ service }.mbtiles`))
  mbtiles.getTile(tile)
    .then(data => {
      res.set('Content-Type', `image/${ (req.params.ext) ? req.params.ext : 'png' }`)
      res.end(data, 'binary')
    }, error => {
      res.json({
        message: 'Tile not found',
        ok: false,
        status: 404,
        url: req.url,
      })
    })
}

export default router
