const generators = require('yeoman-generator')
const mkdir = require('mkdirp')
const defaultName = () => {
  const path = process.cwd().split('/')
  return path[path.length - 1]
}
const devDependencies = [
  'eslint',
  'ava',
  'babel-cli',
  'babel-plugin-transform-es2015-modules-commonjs',
  'babel-register',
  'coveralls',
  'cz-conventional-changelog',
  'ghooks',
  'jsdoc-to-markdown',
  'nyc',
  'semantic-release',
  'eslint-config-standard',
  'validate-commit-msg'
]
const createIP = (name, message, store = false) => ({
  type: 'input',
  name, message, store
})
const createIPD = (name, message, _default) => ({
  type: 'input',
  name, message, default: _default
})
const csvToArray = csv => {
  return csv.replace(',', ' ')
    .split(' ')
    .map(x => x.trim())
    .filter(x => x.length > 0)
}
const normalizeAnswers = (answers) => {
  return Object.assign({}, answers, {
    author: {
      name: answers.authorName,
      url: answers.authorUrl
    },
    dependencies: csvToArray(answers.dependencies),
    keywords: csvToArray(answers.keywords)
  })
}
module.exports = class Yanki extends generators.Base {
  install () {
    this.npmInstall(devDependencies, { 'saveDev': true })
    this.npmInstall(this.dependencies, { 'save': true })
  }
  configuring () {
    mkdir.sync('./src')
  }
  templates () {
    this.template('.babelrc')
    this.template('.eslintrc')
    this.template('.gitignore')
    this.template('.npmignore')
    this.template('.travis.yml')
    this.template('LICENSE.md')
    this.template('package.json')
    this.template('README.template.md')
  }
  prompting () {
    return this.prompt([
      createIPD('name', 'Application\'s name?', defaultName()),
      createIP('description', 'Description?'),
      createIP('githubUser', 'Your Github account?', true),
      createIP('authorName', 'Your name <email>?', true),
      createIP('authorUrl', 'Your url?', true),
      createIP('dependencies', 'Dependencies (csv)'),
      createIP('keywords', 'Keywords (csv)')
    ]).then((answers) => {
      const nAnswers = normalizeAnswers(answers)
      Object.assign(this, nAnswers)
    })
  }
}
