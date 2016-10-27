import { Router, Request, Response } from 'express'
import { PATH, PORT } from '../index'
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
          '/<mbtiles>/{zoom}/{x}/{y}(.png|.jpg)',
        ],
      },
      mbtiles: getFiles(PATH, /\.mbtiles$/),
      ok: true,
      path: PATH,
      port: PORT,
      status: 200,
    })
  })

export default router
