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
    --cache           [~/mbtiles] Cache, the directory where .mbtiles files are located.
    --protocol        [http] Protocol
    --port            [5000] Port
    --domain          [localhost] Domain
    --verbose         [false] Verbose output
    --watch           [false] Watch files and restarts server

  Examples:
    $ mbtiles-server --cache /Users/mac/mbtiles --port 5000 --verbose
`, {
  alias: {v: 'verbose'},
  boolean: ['verbose']
})

// Define default options
const protocol = cli.flags.protocol || DEFAULT.PROTOCOL
const port = cli.flags.port || DEFAULT.PORT
const cache = cli.flags.cache || DEFAULT.CACHE
const domain = cli.flags.domain || DEFAULT.DOMAIN
const verbose = cli.flags.verbose || DEFAULT.VERBOSE
const watch = cli.flags.watch

// Verbose output
const status = `
MBTiles Server

  cache:         ${cache}
  protocol:      ${protocol}
  port:          ${port}
  domain:        ${domain}
  verbose:       ${verbose}
  watch:         ${watch}
`

const ee = server({protocol, cache, domain, port, verbose, watch})

ee.on('start', () => {
  if (verbose) process.stdout.write(status + '\n')
})

ee.on('log', log => {
  if (verbose) process.stdout.write(JSON.stringify(log) + '\n')
})

ee.on('error', error => {
  if (verbose) process.stdout.write(error.message + '\n')
})
