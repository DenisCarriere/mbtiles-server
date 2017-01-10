import * as mbtiles from './index'
import * as utils from './utils'

describe('entry points', () => {
  test('mbtiles', () => expect(mbtiles).toBeDefined())
  test('utils', () => expect(utils).toBeDefined())
})
