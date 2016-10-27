import { Router, Request, Response } from 'express'

const router = Router()

/**
 * Route for Permissions
 */
router.route('*')
  .all((request: Request, response: Response, next: any) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cache-Control,Accept,Accept-Encoding')
    next()
  })

export default router
