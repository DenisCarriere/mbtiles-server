#!/usr/bin/env node
const path = require('path')
const meow = require('meow')
const chalk = require('chalk')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')
const utils = require('../utils')
const DEFAULT = require('../config')

// Update if required
updateNotifier({pkg}).notify()

// Install Background service based on OS
let Service
switch (process.platform) {
  case 'darwin':
    Service = require('node-mac').Service
    break
  case 'win32':
    Service = require('node-windows').Service
    break
  case 'linux':
    Service = require('node-linux').Service
    break
  default:
    utils.error('<platform> not compatible')
    break
}

const cli = meow(`
  Usage:
    $ mbtiles-server-service

  Options:
    --cache           [~/mbtiles] Cache
    --protocol        [http] Protocol
    --port            [5000] Port
    --domain          [localhost] Domain
    --verbose         [false] Verbose output

  Commands:
    start             Start service
    stop              Stop service
    restart           Restart service

  Examples:
    $ mbtiles-server-service start --cache /Users/mac/mbtiles --port 5000 --verbose
`, {
  alias: {v: 'verbose'},
  boolean: ['verbose']
})

// Define default options
const cache = cli.flags.cache || DEFAULT.CACHE
const domain = cli.flags.domain || DEFAULT.DOMAIN
const port = cli.flags.port || DEFAULT.PORT
const protocol = cli.flags.protocol || DEFAULT.PROTOCOL
const verbose = cli.flags.verbose || DEFAULT.VERBOSE
const command = cli.input[0]

// Validate options
if (command === undefined) { utils.error('<command> is required (start|stop|restart)') }

const svc = new Service({
  name: 'mbtiles-server',
  description: require(path.join(__dirname, '..', 'package.json')).description,
  script: path.join(__dirname, 'mbtiles-server'),
  env: [
    { name: 'MBTILES_SERVER_PROTOCOL', value: protocol },
    { name: 'MBTILES_SERVER_DOMAIN', value: domain },
    { name: 'MBTILES_SERVER_CACHE', value: cache },
    { name: 'MBTILES_SERVER_PORT', value: port },
    { name: 'MBTILES_SERVER_VERBOSE', value: verbose }
  ]
})

svc.on('install', () => {
  console.log(chalk.bgGreen.black('Starting: mbtiles-server'))
  console.log(`
MBTiles Server Service

  cache:         ${cache}
  protocol:      ${protocol}
  port:          ${port}
  domain:        ${domain}
  verbose:       ${verbose}
`)
  svc.start()
})

svc.on('uninstall', () => {
  if (command === 'stop') { console.log(chalk.bgRed.white('Stopping: mbtiles-server')) }
  if (command === 'restart' || command === 'start') {
    console.log(chalk.bgRed.white('Restarting: mbtiles-server'))
    setTimeout(() => svc.install(), 1000)
  }
})

// Start/Stop service
switch (command) {
  case 'start':
  case 'restart':
    if (svc.exists) {
      svc.uninstall()
    } else {
      svc.install()
    }
    break
  case 'stop':
    if (svc.exists) {
      svc.uninstall()
    } else {
      console.log(chalk.bgRed.white('Already stopped: mbtiles-server'))
    }
    break
}
