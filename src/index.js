#! /usr/bin/env node

// const { join } = require('path')
const { resolve } = require('path')
const { existsSync } = require('fs')
const { execSync } = require('child_process')
const gitDirsSearch = require('git-dirs-search')
const subDays = require('date-fns/sub_days')
const format = require('date-fns/format')
const sortBy = require('lodash/sortBy')
const reverse = require('lodash/reverse')
// console.log(sortBy);
require('console.table')


// START
var args = process.argv.slice(2);
const dirsToSearch = args
  // filter only existing dirs
  .filter(dir => existsSync(dir))
  .map(dir => resolve(dir))
  ;

let allCommits = []
let toDo = dirsToSearch.length

const dateFrom = format(subDays(new Date(), 7), 'YYYY-MM-DD')
console.log('#######################################')
console.log('##')
console.log('## GIT STATS FROM:', dateFrom, 'TO NOW')
console.log('##')

dirsToSearch.forEach(dirToSearch => {
  console.log('## search for repos in', dirToSearch)
  gitDirsSearch(dirToSearch, (err, dirs) => {
    toDo--;
    if (!err && dirs.length > 0) {
      let l = dirs.length
      dirs.map(dir => console.log('## repo in', dir))

      dirs.map(dir => {
        const logs = getCommits(dir, dateFrom)
        allCommits = [...allCommits, ...logs]
      })

      if (toDo === 0) {
        console.log('##')
        console.log('#######################################')
        console.log('')

        sumAllCommits(allCommits)
      }
    }
  }, { ignores: ['node_modules'], maxDepth: 6 })
})


function getCommits(dir, dateFrom) {
  try {
    const logsString = execSync(`cd ${dir} && git log --since ${dateFrom} --shortstat`).toString()
    const logsArray = logsString.split(/commit [a-z0-9]{40}/g)
      .filter(s => s)
      .map(s => s.trim())
      .filter(s => s.indexOf('Merge') !== 0)
      .map(getCommitFromLogStr);

    return logsArray
  } catch (e) {
    console.log('error in repo:', dir)
    // console.error(e);
    return [];
  }
}

function getCommitFromLogStr(logStr) {
  const logArray = logStr
    .split('\n')
    .filter(s => s) // remove empty lines
  const logArrayLen = logArray.length

  const author = logArray[0].replace(/Author: +/, '')
  const author_name = author.split('<')[0].trim();
  const author_email = author.split('<')[1].replace('>', '')

  const date = logArray[1].replace(/Date: +/, '')
  const message = logArray[2].trim()
  const stats = parseChanged(logArray[logArrayLen-1])

  if (!stats.deletions && !stats.filesChanged && !stats.insertions) {
    throw new Error(`wrong parsing of ${logStr} to ${JSON.stringify(stats)}`)
  }

  return {
    author_name, author_email,
    date, message, stats
  }
}

function findDevelopersInCommits (commits) {
  // console.log('commits len', commits.length);
  const commitsByDeveloper = {}

  commits.map(c => {
    const key = c.author_name || c.author_email

    if (key) {
      if (!commitsByDeveloper[key]) {
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
  const commitsByDeveloper = findDevelopersInCommits(commits)
  // console.log(commitsByDeveloper['Michal Stryluk']);
  // console.log(commitsByDeveloper['Adam Osyra']);
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
        'Commits': cbd.commits.length,
        'Files changed': changed.filesChanged,
        '+': changed.insertions,
        '-': changed.deletions,
        'Diff (+/-)': changed.insertions - changed.deletions
      })
    }
  })

  sums['Diff (+/-)'] = sums['+'] - sums['-']

  sorted = reverse(sortBy(tableData, ['+']))
  sorted.push()
  sorted.push(sums)

  showResults(sorted)
}

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

function getChanged (commits) {
  const sums = {
    filesChanged: 0,
    insertions: 0,
    deletions: 0
  }
  commits.map(c => {
    const sum = c.stats
    sums.filesChanged += sum.filesChanged
    sums.insertions += sum.insertions
    sums.deletions += sum.deletions
  })

  return sums
}

function showResults (data) {
  console.table(data)
}
