import { Router, Request, Response } from 'express'
import { URI, PORT } from '../index'
import { getFiles } from '../utils'

const router = Router()

/**
 * Route for API
 */
router.route('/')
  .all((req: Request, res: Response) => {
    res.json({
      api: `MBTiles Server ${ require('../package').version }`,
      http: {
        GET: [
          '/<mbtiles>',
          '/<mbtiles>/{zoom}/{x}/{y}',
          '/<mbtiles>/WMTS',
          '/<mbtiles>/WMTS/1.0.0/WMTSCapabilities.xml',
        ],
      },
      mbtiles: getFiles(URI, /\.mbtiles$/),
      ok: true,
      uri: URI,
      port: PORT,
      status: 200,
    })
  })

export default router
