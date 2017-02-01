const path = require('path')
const os = require('os')
const server = require('./index')
const meow = require('meow')

const cli = meow(`
    Provides a compatible WMTS Tile Server from MBTiles.
    Usage
      $ mbtiles-server <filepath>
    Options
      --protocol        [http] Protocol
      --port            [5000] Port
      --domain          [localhost] Domain
      --verbose         Verbose output
    Examples
      $ mbtiles-server ~/mbtiles --port 5000 --verbose
`, {
  alias: {v: 'verbose'},
  boolean: ['verbose']
})

// Define default options
const uri = cli.input[0] || path.join(os.homedir(), 'mbtiles')
const domain = cli.flags.domain || 'localhost'
const port = cli.flags.port || 5000
const protocol = cli.flags.protocol || 'http'
const verbose = cli.flags.verbose

// Verbose output
const status = `
MBTiles Server

  uri:           ${uri}
  protocol:      ${protocol}
  port:          ${port}
  domain:        ${domain}
  verbose:       ${verbose}

`
if (verbose) { process.stdout.write(status) }

// Start
server.start(uri, {domain, port, protocol, verbose})
