const router = require('express').Router()

/**
 * Route for Permissions
 */
router.route('*')
  .all((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cache-Control,Accept,Accept-Encoding')
    next()
  })

module.exports = router
