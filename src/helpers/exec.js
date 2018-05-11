// @ts-check

const { exec } = require('child_process')

function execFn (dir, cmd) {
  const fullCmd = `cd ${dir} && ${cmd}`
  return new Promise(
    (resolve, reject) => exec(fullCmd, (err, data) =>
      err ? reject(err) : resolve(data)
    )
  )
}

module.exports = execFn
