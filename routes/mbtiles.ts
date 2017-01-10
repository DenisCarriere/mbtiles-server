import * as path from 'path'
import * as mercator from 'global-mercator'
import { Router, Request, Response } from 'express'
import { URI } from '../index'
import { Tile, getFiles } from '../utils'
import { MBTiles } from 'mbtiles-offline'
import * as tiletype from '@mapbox/tiletype'

const router = Router()

interface MBTilesRequest extends Request {
  params: {
    mbtiles: string
    x: string
    y: string
    z: string
    ext: string,
  }
}

/**
 * Route MBTiles Metadata
 */
router.route('/:mbtiles')
  .get(async(req: MBTilesRequest, res: Response) => {
    const service = req.params.mbtiles

    // Check if Service exists
    if (getFiles(URI, /\.mbtiles$/).indexOf(service) === -1) {
      return res.json({
        message: `[${ service }] service is not found`,
        ok: false,
        status: 500,
        url: req.url,
      })
    }
    // Fetch tile from local MBTiles
    const mbtiles = new MBTiles(path.join(URI, `${ service }.mbtiles`))
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
  const tms: Tile = [Number(req.params.x), Number(req.params.y), Number(req.params.z)]
  let tile: Tile

  // Check if Service exists
  if (getFiles(URI, /\.mbtiles$/).indexOf(service) === -1) {
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
  const mbtiles = new MBTiles(path.join(URI, `${ service }.mbtiles`))
  mbtiles.findOne(tile)
    .then(data => {
      if (data === undefined) {
        return res.json({
          message: 'Tile not found',
          ok: false,
          status: 404,
          url: req.url,
        })
      }
      res.set(tiletype.headers(data))
      res.end(data, 'binary')
    })
}

export default router
