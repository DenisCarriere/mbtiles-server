# MBTiles Server

[![Build Status](https://travis-ci.org/DenisCarriere/mbtiles-server.svg?branch=master)](https://travis-ci.org/DenisCarriere/mbtiles-server)
[![Coverage Status](https://coveralls.io/repos/github/DenisCarriere/mbtiles-server/badge.svg?branch=master)](https://coveralls.io/github/DenisCarriere/mbtiles-server?branch=master)
[![npm version](https://badge.fury.io/js/mbtiles-server.svg)](https://badge.fury.io/js/mbtiles-server)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/DenisCarriere/mbtiles-server/master/LICENSE)

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Provides a compatible WMTS Tile Server from MBTiles.

## Install

```bash
$ npm install -g mbtiles-server
```

## Quickstart

```bash
$ mbtiles-server --cache /Users/mac/mbtiles --verbose --port 3000
MBTiles Server Service

  cache:         /Users/mac/mbtiles
  protocol:      http
  port:          3000
  domain:        localhost
  verbose:       true
```

## Background Service

You can also run this server as a native OS background service.

```bash
$ sudo mbtiles-server-service start
Starting: mbtiles-server
```

## Environment Variables

You can also define the CLI options as environment variables using the following:

```bash
$ export MBTILES_SERVER_PROTOCOL=http
$ export MBTILES_SERVER_DOMAIN=localhost
$ export MBTILES_SERVER_CACHE=/home/ubuntu/mbtiles
$ export MBTILES_SERVER_PORT=5000
$ export MBTILES_SERVER_VERBOSE=true
```

## Docker

A Dockerfile is provided for easy Docker deployment

```
$ docker pull deniscarriere/mbtiles-server
$ docker run --rm -it \
  -p 5000:5000 \
  -v /home/ubuntu/mbtiles/:/root/mbtiles \
  deniscarriere/mbtiles-server
```

**Start containers automatically**

https://docs.docker.com/engine/admin/host_integration/

```
$ docker run -d \
  --name mbtiles-server \
  -p 5000:5000 \
  -v /home/ubuntu/mbtiles/:/root/mbtiles \
  deniscarriere/mbtiles-server
```

## CLI Help

For any additional help using the CLI, use the `--help` flag.

```bash
  Provides a compatible WMTS Tile Server from MBTiles.

  Usage
    $ mbtiles-server

  Options
    --cache           [~/mbtiles] Cache
    --protocol        [http] Protocol
    --port            [5000] Port
    --domain          [localhost] Domain
    --verbose         [false] Verbose output

  Examples
    $ mbtiles-server --cache /Users/mac/mbtiles --port 5000 --verbose
```

## WMTS

The goal of providing a WMTS enabled service is to be performance oriented and
scalable. Therefore, servers must be able to return tiles quickly. A good way to achieve
that is to use locally stored pre-rendered tiles that will not require any image
manipulation or geo-processing.

## API

### start

Start Server

**Parameters**

-   `options` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Server Options
    -   `options.cache` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** CACHE file path (optional, default `~/mbtiles`)
    -   `options.protocol` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** URL Protocol (optional, default `'http'`)
    -   `options.domain` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** URL Domain (optional, default `'localhost'`)
    -   `options.port` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** URL Port (optional, default `5000`)
    -   `options.verbose` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Verbose output (optional, default `false`)

**Examples**

```javascript
server.start({cache: '/Users/mac/mbtiles', port: 5000, verbose: true})
```

Returns **void** System output for logs
