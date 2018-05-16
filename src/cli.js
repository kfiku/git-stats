#! /usr/bin/env node
// @ts-check

const { resolve } = require('path')
const { existsSync } = require('fs')
const sortBy = require('lodash/sortBy')
const reverse = require('lodash/reverse')
const subDays = require('date-fns/sub_days')
const format = require('date-fns/format')

const { developersCommitsInDates } = require('./index')

require('console.table') // eslint-disable-line

process.on('unhandledRejection', (err) => { // eslint-disable-line
  console.error(err) // eslint-disable-line
  process.exit(1) // eslint-disable-line
})

const args = process.argv.slice(2)
const dirsToSearch = args
  .filter(dir => existsSync(dir))
  .map(dir => resolve(dir))

const dateFrom = subDays(new Date(), 7)
const dateTo = new Date()

function sumTableData (tableData) {
  const sum = {
    'Developer': `SUM`,
    'Commits': 0,
    'Files changed': 0,
    '+': 0,
    '-': 0,
    'Diff (+/-)': 0
  }

  return tableData.reduce((acc, current) => {
    return {
      'Developer': `SUM`,
      'Commits': acc.Commits + current.Commits,
      'Files changed': acc['Files changed'] + current['Files changed'],
      '+': acc['+'] + current['+'],
      '-': acc['-'] + current['-'],
      'Diff (+/-)': (acc['+'] + current['+']) - (acc['-'] + current['-'])
    }
  }, sum)
}

// START
async function start (dirsToSearch, dateFrom, dateTo) {
  /* eslint-disable fp/no-unused-expression */
  /* eslint-disable no-console */
  console.log('####################')
  console.log('## SEARCHING FOR COMMITS IN ' + dirsToSearch + ' IN DATES: ' + format(dateFrom, 'YYYY-MM-DD') + ' - ' + format(dateTo, 'YYYY-MM-DD'))

  const developersCommits = await developersCommitsInDates(dirsToSearch, dateFrom, dateTo, (type, dirs) => {
    console.log('####################')
    console.log('## ' + type)
    dirs.map(dir => console.log('## ' + dir))

    return false
  })

  console.log('####################')
  console.log('')

  const tableData = Object.keys(developersCommits).map(developerEmail => {
    const dev = developersCommits[developerEmail]
    const stats = dev.stats
    return {
      // 'Developer': `${dev.author.name} <${dev.author.email}>`,
      'Developer': `${dev.author.name}`,
      'Commits': dev.commits.length,
      'Files changed': stats.filesChanged,
      '+': stats.insertions,
      '-': stats.deletions,
      'Diff (+/-)': stats.insertions - stats.deletions
    }
  })

  const sorted = reverse(sortBy(tableData, ['+']))

  const sums = sumTableData(tableData)

  console.table([...sorted, sums]) // eslint-disable-line

  return true
}

start(dirsToSearch, dateFrom, dateTo) // eslint-disable-line
