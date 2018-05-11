// @ts-check

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
 * @param {CommitObj[]} commits
 * @returns {{any?: CommitsByDevelopersObj}}
 */
function commitsByDevelopers (commits) {
  return commits.reduce((acc, current) => {
    const key = current.authorEmail
    const authorCommits = acc[key] || {
      author: {
        name: current.authorName,
        email: current.authorEmail
      },
      stats: {
        filesChanged: 0,
        insertions: 0,
        deletions: 0
      },
      commits: []
    }

    // pushing commits to author commits
    const newCommits = [...authorCommits.commits, current]
    // console.log(current);
    const newStats = sumSums(authorCommits.stats, current.stats)
    const updatedAuthorCommits = Object.assign({}, authorCommits, {
      commits: newCommits,
      stats: newStats
    })

    // updating developer in accumulator
    return Object.assign({}, acc, {
      [key]: updatedAuthorCommits
    })
  }, {})
}

/**
 * @param {CommitObjStats} sum1
 * @param {CommitObjStats} sum1
 * @returns {CommitObjStats}
 */
function sumSums (sum1, sum2) {
  return {
    filesChanged: sum1.filesChanged + sum2.filesChanged,
    insertions: sum1.insertions + sum2.insertions,
    deletions: sum1.deletions + sum2.deletions
  }
}

module.exports = commitsByDevelopers
