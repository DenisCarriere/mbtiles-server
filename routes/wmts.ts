import { Router, Request, Response } from 'express'
import { PORT, DOMAIN, PROTOCOL } from '../index'
import * as wmts from '../../wmts'

const router = Router()

interface WMTSRequest extends Request {
  query: {
    service: string
    version: string
    request: string
  }
}

/**
 * Route for WMTS
 */
router.route('/')
  .all((req: WMTSRequest, res: Response) => {
    console.log(req.query)
    if (req.query.service !== 'WMTS') {
      return res.json({
        ok: false,
        status: 400,
        message: '[service] is invalid',
      })
    }
    if (req.query.version !== '1.0.0') {
      return res.json({
        ok: false,
        status: 400,
        message: '[version] is invalid',
      })
    }
    if (req.query.request !== 'GetCapabilities') {
      return res.json({
        ok: false,
        status: 400,
        message: '[request] is invalid',
      })
    }
    const capabilities = wmts.getCapabilities({
      uri: 'http://localhost:5000/wmts',
      name: 'Denis',
      title: 'This is Title',
      abstract: 'Abstract',
      keywords: ['words', 1324, 'more words'],
    })
    res.set('Content-Type', 'text/xml')
    res.send(capabilities)
  })


export default router
