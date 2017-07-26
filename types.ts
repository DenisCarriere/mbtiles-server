import * as server from './'

const ee = server({cache: '~/mbtiles'})

ee.on('start', () => console.log('boom!'))
ee.on('log', log => console.log(log.ip))
ee.on('end', () => console.log('sad :('))
ee.on('error', error => console.log(error.message))
