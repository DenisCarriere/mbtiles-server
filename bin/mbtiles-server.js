#!/usr/bin/env node
const meow = require('meow')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')
const DEFAULT = require('../config')
const server = require('../')

// Update if required
updateNotifier({pkg}).notify()

const cli = meow(`
  Usage:
    $ mbtiles-server

  Options:
    --cache           [~/mbtiles] Cache
    --port            [5000] Port
    --domain          [localhost] Domain
    --verbose         [false] Verbose output

  Examples:
    $ mbtiles-server --cache /Users/mac/mbtiles --port 5000 --verbose
`, {
  alias: {v: 'verbose'},
  boolean: ['verbose']
})

// Define default options
const port = cli.flags.port || DEFAULT.PORT
const cache = cli.flags.cache || DEFAULT.CACHE
const domain = cli.flags.domain || DEFAULT.DOMAIN
const verbose = cli.flags.verbose || DEFAULT.VERBOSE

// Verbose output
const status = `
MBTiles Server

  cache:         ${cache}
  port:          ${port}
  domain:        ${domain}
  verbose:       ${verbose}
`

const ee = server({cache, domain, port, verbose})

ee.on('start', () => {
  if (verbose) process.stdout.write(status + '\n')
})

ee.on('log', log => {
  if (verbose) process.stdout.write(JSON.stringify(log) + '\n')
})
