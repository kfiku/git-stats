// @ts-check

const { join } = require('path')
const searchForGitDirs = require('./searchForGitDirs')

/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-nil */

describe('searchForGitDirs', () => {
  it('searchForGitDirs', async () => {
    const result = await searchForGitDirs(['./', './', './src'])
    expect(result).toEqual([join(__dirname, '..', '..')])
  })
})
