import * as server from './'

const ee = server({cache: '~/mbtiles', verbose: true})

ee.on('start', () => console.log('boom!'))
