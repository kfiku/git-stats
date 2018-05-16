// @ts-check

/* eslint-disable fp/no-unused-expression */
/* eslint-disable fp/no-nil */

const { developersCommitsInDates } = require('./index')

jest.mock('./helpers/exec')

describe('developersCommitsInDates', () => {
  it('should work fine', async () => {
    const result = await developersCommitsInDates([''], new Date(), new Date(), () => {})
    expect(result).toMatchSnapshot()
  })
})
