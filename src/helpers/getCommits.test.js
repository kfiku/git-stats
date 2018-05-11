// @ts-check

const getCommits = require('./getCommits')
const { exampleGitLog, exampleSingleGitLog } = require('./fixtures/git')

/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-nil */

describe('getCommits', () => {
  it('single git log result', async () => {
    const result = await getCommits('', new Date(), new Date(), () => exampleSingleGitLog)
    expect(result).toEqual([{
      authorEmail: 'kfiku.com@gmail.com',
      authorName: 'Grzegorz Klimek',
      date: 'Thu Feb 22 10:36:48 2018 +0100',
      message: 'cleanup',
      stats: {
        deletions: 1,
        filesChanged: 1,
        insertions: 0
      }
    }])
    expect(result).toMatchSnapshot()
  })

  it('multiple git logs', async () => {
    const result = await getCommits('', new Date(), new Date(), () => exampleGitLog)
    expect(result).toMatchSnapshot()
  })
})
