// @ts-check

const format = require('date-fns/format')

const execFn = require('./exec')

const filterNotEmpty = (s) => s

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
 * @param {string} dir dir where to get git log
 * @param {Date} dateFrom date from when to search for logs
 * @param {Date} dateTo date to when to search for logs
 * @param {Function} exec exec function (witch returns Promise) to exec git cmd (mainly for testing)
 * @returns {Promise<CommitObj[]>}
 */
async function getCommits (dir, dateFrom, dateTo, exec = execFn) {
  const after = format(dateFrom, 'YYYY-MM-DD')
  const before = format(dateTo, 'YYYY-MM-DD')
  const logsString = await getCommitsStr(dir, after, before, exec)
  const logsArray = logsString.split(/commit [a-z0-9]{40}/g)

  return logsArray
    .map(s => s && s.trim())
    .filter(filterNotEmpty) // remove empty lines
    .filter(s => s.indexOf('Merge') !== 0) // remove Merge commits
    .map(s => getCommitObjFromLogStr(s))
    .filter(filterNotEmpty) // remove empty lines
}
/**
 * @param {string} dir dir where to get git log
 * @param {string} after date from when to search for logs
 * @param {string} before date to when to search for logs
 * @param {Function} exec exec function (witch returns Promise) to exec git cmd (mainly for testing)
 * @returns {Promise<string>}
 */
async function getCommitsStr(dir, after, before, exec) { // eslint-disable-line
  try {
    const logsString = await exec(dir, `git log --after ${after} --before ${before} --shortstat`)
    return logsString
  } catch (error) {
    return ''
  }
}

/**
 * @param {string} logStr string with git log
 * @returns {CommitObj}
 */
function getCommitObjFromLogStr (logStr) {
  const logArray = logStr
    .split('\n')
    .filter(filterNotEmpty) // remove empty lines
  const logArrayLen = logArray.length

  if (logArrayLen < 4) {
    return undefined // eslint-disable-line fp/no-nil
  }

  const author = logArray[0].replace(/Author: +/, '')
  const authorName = author.split('<')[0].trim()
  const authorEmail = author.split('<')[1].replace('>', '')

  const date = logArray[1].replace(/Date: +/, '')
  const message = logArray[2].trim()
  const stats = parseChanged(logArray[logArrayLen - 1])

  if (!stats.deletions && !stats.filesChanged && !stats.insertions) {
    return undefined // eslint-disable-line fp/no-nil
  }

  const obj = {
    authorName,
    authorEmail,
    date,
    message,
    stats
  }

  return obj
}

/**
 * @param {string} str string with git log --shortstat stats to parse
 * @returns {CommitObjStats}
 */
function parseChanged (str) {
  const filesChanged = str.match(/([0-9]+) files? changed/)
  const insertions = str.match(/([0-9]+) insertions?/)
  const deletions = str.match(/([0-9]+) deletions?/)

  return {
    filesChanged: filesChanged ? Number(filesChanged[1]) : 0,
    insertions: insertions ? Number(insertions[1]) : 0,
    deletions: deletions ? Number(deletions[1]) : 0
  }
}

module.exports = getCommits
