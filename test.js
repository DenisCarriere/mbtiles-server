const server = require('.')
const utils = require('./utils')

describe('entry points', () => {
  test('server', () => expect(server).toBeDefined())
  test('utils', () => expect(utils).toBeDefined())
})
