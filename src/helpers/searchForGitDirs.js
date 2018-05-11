// @ts-check

const uniq = require('lodash/uniq')
const gitDirsSearch = require('git-dirs-search')

/**
 * @param {string[]} dirsToSearch
 */
async function searchForGitDirs (dirsToSearch) {
  const allDirs = await Promise.all(dirsToSearch.map(singleSearch))
  const mergedDirs = uniq(
    allDirs.reduce((acc, current) => {
      return [...acc, ...current]
    }, [])
  )
  return mergedDirs
}

/**
 *
 * @param {string} dir
 * @returns {Promise<string[]>} dir
 */
function singleSearch (dir) {
  return new Promise((resolve, reject) =>
    gitDirsSearch(
      dir,
      (err, dirs) => err ? resolve([]) : resolve(dirs),
      { ignores: ['node_modules'], maxDepth: 6 }
    )
  )
}

module.exports = searchForGitDirs
