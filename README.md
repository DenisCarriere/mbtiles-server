# MBTiles Server

[![Build Status](https://travis-ci.org/DenisCarriere/mbtiles-server.svg?branch=master)](https://travis-ci.org/DenisCarriere/mbtiles-server)
[![CircleCI](https://circleci.com/gh/DenisCarriere/mbtiles-server.svg?style=svg)](https://circleci.com/gh/DenisCarriere/mbtiles-server)
[![Coverage Status](https://coveralls.io/repos/github/DenisCarriere/mbtiles-server/badge.svg?branch=master)](https://coveralls.io/github/DenisCarriere/mbtiles-server?branch=master)
[![npm version](https://badge.fury.io/js/mbtiles-server.svg)](https://badge.fury.io/js/mbtiles-server)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/DenisCarriere/mbtiles-server/master/LICENSE)

Provides a compatible WMTS Tile Server from MBTiles.

## Install

```bash
$ npm install --save mbtiles-servers
```

## Quickstart

```bash
$ npm start

MBTiles Server

  uri:           /Users/mac/mbtiles
  protocol:      http
  port:          5000
  domain:        localhost
  verbose:       true

Listening on PORT 5000
```

## CLI

```bash
$ npm install -g mbtiles-server
$ mbtiles-server --verbose ~/mbtiles
```

## WMTS

The goal of providing a WMTS enabled service is to be performance oriented and
scalable. Therefore, servers must be able to return tiles quickly. A good way to achieve
that is to use locally stored pre-rendered tiles that will not require any image
manipulation or geo-processing.

## Environment Variables

```
export MBTILES_SERVER_PROTOCOL=http
export MBTILES_SERVER_DOMAIN=localhost
export MBTILES_SERVER_CACHE=/home/ubuntu/mbtiles
export MBTILES_SERVER_PORT=5000
export MBTILES_SERVER_VERBOSE=true
```

## API

# start

Start Server

**Parameters**

-   `uri` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** URI file path (optional, default `~/mbtiles`)
-   `options` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Server Options
    -   `options.protocol` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** URL Protocol (optional, default `'http'`)
    -   `options.domain` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** URL Domain (optional, default `'localhost'`)
    -   `options.port` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** URL Port (optional, default `5000`)
    -   `options.verbose` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Verbose output (optional, default `false`)

**Examples**

```javascript
server.start('~/mbtiles', {port: 5000, verbose: true})
```

Returns **void** System output for logs

