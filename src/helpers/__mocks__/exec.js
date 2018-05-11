// @ts-check

const { exampleGitLog } = require('../fixtures/git')

function execFn (dir, cmd) {
  return new Promise(
    (resolve, reject) => resolve(exampleGitLog)
  )
}

module.exports = execFn
