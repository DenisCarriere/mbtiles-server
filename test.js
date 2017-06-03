const path = require('path')
const {test} = require('tap')
const {getFiles} = require('./utils')
const server = require('./')

test('utils', t => {
  const files = getFiles(path.join(__dirname, 'test', 'fixtures'))
  t.deepEqual(files, [ 'canada_zoom_0-3', 'fiji_zoom_0-4', 'world_zoom_0-2' ])
  t.end()
})

test('server -- start & close', t => {
  const ee = server({port: 3000})
  ee.on('start', async () => {
    t.pass()
    await ee.close()
    t.end()
  })
})

test('server -- restart', t => {
  const ee = server({port: 3001})
  setTimeout(async () => {
    await ee.restart({port: 3002})
    t.pass()
    await ee.close()
    t.end()
  })
})
