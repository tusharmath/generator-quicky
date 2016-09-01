/**
 * Created by tushar.mathur on 01/09/16.
 */

'use strict'

const npmName = require('npm-name')
const R = require('ramda')
const chalk = require('chalk')

const message = (name) => chalk.red(
  `\n  ${chalk.bold(name)} already exists!\n`
)
module.exports = R.curry((generator, name) =>
  npmName(name).then(t => {
    if (!t) generator.log(message(name))
    return t
  }))
