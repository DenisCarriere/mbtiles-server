const path = require('path')
const {test} = require('tap')
const {getFiles} = require('./utils')

test('utils', t => {
  const files = getFiles(path.join(__dirname, 'test', 'fixtures'))
  t.deepEqual(files, [ 'canada_zoom_0-3', 'fiji_zoom_0-4', 'world_zoom_0-2' ])
  t.end()
})
