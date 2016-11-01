import * as path from 'path'
import * as mercator from 'global-mercator'
import { Router, Request, Response } from 'express'
import { PATH } from '../index'
import { Tile, getFiles, MBTiles } from '../utils'

const router = Router()

interface MBTilesRequest extends Request {
  params: {
    mbtiles: string
  }
}

/**
 * Route for API
 */
router.route('/:mbtiles/:z(\\d+)/:x(\\d+)/:y(\\d+):ext(.jpg|.png|)')
  .get(GetTile)
router.route('/:mbtiles/WMTS/tile/1.0.0/:mbtiles/:Style/:TileMatrixSet/:z(\\d+)/:y(\\d+)/:x(\\d+):ext(.jpg|.png|)')
  .get(GetTile)

async function GetTile(req: Request, res: Response) {
  const tms = [Number(req.params.x), Number(req.params.y), Number(req.params.z)]
  const tile = mercator.tileToGoogle(tms)
  const mbtiles = new MBTiles(path.join(PATH, `${ req.params.mbtiles }.mbtiles`))
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
