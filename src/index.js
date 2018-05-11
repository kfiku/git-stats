// @ts-check

const searchForGitDirs = require('./helpers/searchForGitDirs')
const getCommits = require('./helpers/getCommits')
const commitsByDevelopers = require('./helpers/commitsByDevelopers')

async function developersCommitsInDates (dirsToSearch, dateFrom, dateTo) {
  const dirs = await searchForGitDirs(dirsToSearch)
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
