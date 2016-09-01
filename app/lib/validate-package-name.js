/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

const npmName = require('npm-name')
const R = require('ramda')
const chalk = require('chalk')

const waitMessage = chalk.dim('\n  validating ...')
const errMessage = (name) => chalk.red(
  `  ${chalk.bold(name)} already exists!\n`
)
module.exports = R.curry((generator, name) => {
  generator.log(waitMessage)
  return npmName(name).then(t => {
    if (!t) generator.log(errMessage(name))
    return t
  })
})
