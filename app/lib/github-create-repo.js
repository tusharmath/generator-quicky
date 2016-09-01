/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

const icons = require('./icons')
const chalk = require('chalk')
const Github = require('github')
const g = new Github({})

module.exports = ({generator, username, password, name}) => {
  generator.log(chalk.dim('   Github authenticating ...'))
  g.authenticate({
    type: 'basic',
    username, password
  })
  generator.log(chalk.dim('   Creating repo ...'))
  return g.repos.create({name})
    .then(
      x => generator.log(`\n${(icons.tick)} Repository created`),
      err => generator.log(
        `\n${icons.cross} Repository could not be created \n ${chalk.red(err.message)}`
      )
    )
}
