import { Router, Request, Response } from 'express'
import { PROTOCOL, DOMAIN, PORT, PATH } from '../index'
import { getFiles } from '../utils'
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

function WMTSCapabilities(req: WMTSRequest, res: Response) {
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

  // Return XML
  const capabilities = wmts.getCapabilities({
    uri: `${ PROTOCOL}://${ DOMAIN }:${ PORT }/${ service }/WMTS`,
    title: service,
    minZoom: 1,
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

export default router
