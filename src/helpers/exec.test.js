// @ts-check

const exec = require('./exec')

/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-nil */

describe('exec', () => {
  it('should work fine', async () => {
    const result = await exec(__dirname, 'ls exec.js')
    expect(result).toMatchSnapshot()
  })

  it('should throw', async () => {
    const fn = async () => {
      await exec(__dirname, 'NonExistingCmd')
    }

    expect(fn()).rejects.toBeDefined()
  })
})
