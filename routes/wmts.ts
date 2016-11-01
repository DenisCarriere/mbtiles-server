import { Router, Request, Response } from 'express'
import { PROTOCOL, DOMAIN, PORT } from '../index'
import * as wmts from 'wmts'

const router = Router()

interface WMTSRequest extends Request {
  params: {
    mbtiles: string
  },
  query: {
    service: string
    request: string
    version: string
  }
}

function getCapabilities(service: string) {
  // return fs.readFileSync(path.join(__dirname, 'arcgis.xml'))
  return wmts.getCapabilities({
    uri: `${ PROTOCOL}://${ DOMAIN }:${ PORT }/${ service }/WMTS`,
    title: service,
    minZoom: 1,
  })
}

/**
 * Route for RESTFul WMTS Capabilities
 */
router.route('/:mbtiles/WMTS/1.0.0/WMTSCapabilities.xml')
  .all((req: WMTSRequest, res: Response) => {
    res.set('Content-Type', 'text/xml')
    res.send(getCapabilities(req.params.mbtiles))
  })

/**
 * Route for KVP WMTS
 */
router.route('/:mbtiles/WMTS')
  .all((req: WMTSRequest, res: Response) => {
    res.set('Content-Type', 'text/xml')
    res.send(getCapabilities(req.params.mbtiles))
  })

export default router

