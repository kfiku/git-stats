// const { join } = require('path')
const gitDirsSearch = require('git-dirs-search')
const simpleGit = require('simple-git')
const subDays = require('date-fns/sub_days')
const format = require('date-fns/format')
require('console.table')

const dir = '/media/dev/www/casino/betor'

let allCommits = []

gitDirsSearch(dir, (err, dirs) => {
  if (!err && dirs.length > 0) {
    let l = dirs.length
    const dateFrom = format(subDays(new Date(), 7), 'YYYY-MM-DD')

    console.log('#######################################')
    console.log('##')
    console.log('## GIT STATS FROM:', dateFrom, 'TO NOW')
    console.log('##')
    console.log('#######################################')
    console.log('')

    dirs.map(dir => {
      // console.log(dir)
      const repo = simpleGit(dir)

      repo.log({
        '--since': dateFrom,
        '--shortstat': true
      }, (err, data) => {
        if (err) {
          throw err
        }

        allCommits = [...allCommits, ...data.all]

        l--
        if (l === 0) {
          sumAllCommits(allCommits)
        }
      })
    })
  }
}, { ignores: ['node_modules'], maxDepth: 6 })

function findDevelopersInCommits (commits) {
  // console.log('commits len', commits.length);
  const commitsByDeveloper = {}

  commits.map(c => {
    const key = c.author_name || c.author_email

    if (key) {
      if (!commitsByDeveloper[key]) {
        // console.log(key, c)
        // console.log(key, Object.keys(commitsByDeveloper))
        commitsByDeveloper[key] = {
          author: key,
          commits: []
        }
      }

      commitsByDeveloper[key].commits.push(c)
    }
  })

  return commitsByDeveloper
}

function sumAllCommits (commits) {
  // console.log('all commits: ', commits.length)
  const commitsByDeveloper = findDevelopersInCommits(commits)
  // console.log(commitsByDeveloper);
  const tableData = []
  const commitsByDeveloperArray = Object.keys(commitsByDeveloper)

  const sums = {
    'Developer': `SUM`,
    'Commits': 0,
    'Files changed': 0,
    '+': 0,
    '-': 0,
    'Diff (+/-)': 0
  }

  commitsByDeveloperArray
  .map(cbdKey => {
    if (['GLTDocker', 'jenkins@multivlt.com'].indexOf(cbdKey) === -1) {
      const cbd = commitsByDeveloper[cbdKey]
      const changed = getChanged(cbd.commits)

      sums['Commits'] += cbd.commits.length
      sums['Files changed'] += changed.filesChanged
      sums['+'] += changed.insertions
      sums['-'] += changed.deletions

      tableData.push({
        'Developer': `${cbd.author}`,
        'Commits': changed.filesChanged,
        'Files changed': changed.filesChanged,
        '+': changed.insertions,
        '-': changed.deletions,
        'Diff (+/-)': changed.insertions - changed.deletions
      })
    }
  })

  sums['Diff (+/-)'] = sums['+'] - sums['-']

  tableData.sort((a, b) => a['+'] < b['+'])
  tableData.push()
  tableData.push(sums)

  showResults(tableData)
}

function parseChanged (str) {
  const filesChanged = str.match(/([0-9]+) files changed/)
  const insertions = str.match(/([0-9]+) insertions/)
  const deletions = str.match(/([0-9]+) deletions/)

  return {
    filesChanged: filesChanged ? Number(filesChanged[1]) : 0,
    insertions: insertions ? Number(insertions[1]) : 0,
    deletions: deletions ? Number(deletions[1]) : 0
  }
}

function getChanged (commits) {
  const sums = {
    filesChanged: 0,
    insertions: 0,
    deletions: 0
  }
  commits.map(c => {
    // console.log(c.hash)
    const sum = parseChanged(c.hash)
    sums.filesChanged += sum.filesChanged
    sums.insertions += sum.insertions
    sums.deletions += sum.deletions
  })

  return sums
}

function showResults (data) {
  console.table(data)
}
