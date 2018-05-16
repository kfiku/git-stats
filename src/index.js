// @ts-check

const searchForGitDirs = require('./helpers/searchForGitDirs')
const getCommits = require('./helpers/getCommits')
const commitsByDevelopers = require('./helpers/commitsByDevelopers')

/**
 * @typedef {object} CommitObjStats
 * @property {number} filesChanged
 * @property {number} insertions
 * @property {number} deletions

/**
 * @typedef {object} CommitObj
 * @property {string} authorName - author name of commit.
 * @property {string} authorEmail - author email of commit.
 * @property {string} date - date of commit.
 * @property {string} message - message of commit.
 * @property {CommitObjStats} stats - stats of commit.
 */

/**
 * @typedef {object} CommitsByDevelopersAuthorObj
 * @property {string} authorName - author name of commits.
 * @property {string} authorEmail - author email of commits.
 */

/**
 * @typedef {object} CommitsByDevelopersObj
 * @property {CommitsByDevelopersAuthorObj} author - author of commits.
 * @property {CommitObj[]} commits - commits.
 */

/**
 * @param {string[]} dirsToSearch
 * @param {Date} dateFrom
 * @param {Date} dateTo
 * @returns {Promise<{any?: CommitsByDevelopersObj}>}
 */
async function developersCommitsInDates (dirsToSearch, dateFrom, dateTo, progress) {
  const dirs = await searchForGitDirs(dirsToSearch)
  if (progress) {
    progress('DIRS', dirs) // eslint-disable-line fp/no-unused-expression
  }

  const commitsArray = await Promise.all(
    dirs.map(dir =>
      getCommits(dir, dateFrom, dateTo)
    )
  )
  const commits = commitsArray.reduce((acc, current) => [...acc, ...current], [])
  const developersCommits = commitsByDevelopers(commits)

  return developersCommits
}

module.exports = {
  developersCommitsInDates
}
