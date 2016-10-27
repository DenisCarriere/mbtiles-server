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

export function getTile(req: Request): Tile {
  const tile = [Number(req.params.x), Number(req.params.y), Number(req.params.z)]
  return mercator.tileToGoogle(tile)
}

/**
 * Route for API
 */
router.route('/:mbtiles/:z(\\d+)/:x(\\d+)/:y(\\d+):ext(.jpg|.png|)')
  .all(async (req: Request, res: Response) => {
    // if (getFiles()[req.params.mbtiles] === undefined) {
    //   return res.json({
    //     message: '<mbtiles> not found',
    //     ok: false,
    //     status: 404,
    //   })
    // }
    const tile = getTile(req)
    const mbtiles = new MBTiles(path.join(PATH, `${ req.params.mbtiles }.mbtiles`))
    const data = await mbtiles.getTile(tile)
    res.end(data, 'binary')
  })

export default router
