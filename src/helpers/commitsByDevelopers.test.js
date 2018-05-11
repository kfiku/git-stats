// @ts-check

const commitsByDevelopers = require('./commitsByDevelopers')
const { commitsObjects, commitsObjectsMultiple } = require('./fixtures/git')

/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-nil */

describe('commitsByDevelopers', () => {
  it('single git log result', async () => {
    const result = commitsByDevelopers(commitsObjects)
    expect(result).toMatchSnapshot()
  })

  it('multiple git log result', async () => {
    const result = commitsByDevelopers(commitsObjectsMultiple)
    expect(result['kfiku.com@gmail.com'].commits.length).toBe(3)
    expect(result['john@localhost'].commits.length).toBe(1)
    expect(result['jan@localhost'].commits.length).toBe(2)

    expect(result['kfiku.com@gmail.com'].stats.filesChanged).toBe(3)
    expect(result['kfiku.com@gmail.com'].stats.insertions).toBe(9)
    expect(result['kfiku.com@gmail.com'].stats.deletions).toBe(4)

    expect(result['john@localhost'].stats.filesChanged).toBe(1)
    expect(result['john@localhost'].stats.insertions).toBe(0)
    expect(result['john@localhost'].stats.deletions).toBe(1)

    expect(result['jan@localhost'].stats.filesChanged).toBe(6)
    expect(result['jan@localhost'].stats.insertions).toBe(5)
    expect(result['jan@localhost'].stats.deletions).toBe(18)

    expect(result).toMatchSnapshot()
  })
})
