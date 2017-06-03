const path = require('path')
const axios = require('axios')
const server = require('./')

const cache = path.join(__dirname, 'test', 'fixtures')
const config = {responseType: 'arraybuffer'}
const ee = server({cache})

// http://localhost:5000/world_zoom_0-2/2/2/2
function randomURL () {
  const x = Math.round(Math.random() * 2)
  const y = Math.round(Math.random() * 2)
  const z = 2
  return `http://localhost:5000/world_zoom_0-2/${[z, x, y].join('/')}`
}

/**
 * Benchmark Results
 *
 * 1 request: 33.460ms
 * 10 requests: 45.223ms
 * 100 requests: 374.217ms
 * 1K requests: 2698.584ms
 * 10K requests: 25457.490ms
 */
async function bench () {
  console.time('1 request')
  await axios(randomURL(), config)
  console.timeEnd('1 request')

  console.time('10 requests')
  for (let i = 0; i < 10; i++) await axios(randomURL(), config)
  console.timeEnd('10 requests')

  console.time('100 requests')
  for (let i = 0; i < 100; i++) await axios(randomURL(), config)
  console.timeEnd('100 requests')

  console.time('1K requests')
  for (let i = 0; i < 1000; i++) await axios(randomURL(), config)
  console.timeEnd('1K requests')

  console.time('10K requests')
  for (let i = 0; i < 10000; i++) await axios(randomURL(), config)
  console.timeEnd('10K requests')

  ee.close()
}
bench()
