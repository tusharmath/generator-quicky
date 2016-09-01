const generators = require('yeoman-generator')
const mkdir = require('mkdirp')
const validatePackageName = require('./lib/validate-package-name')
const devDependencies = require('./lib/devDependencies')
const githubCreateRepo = require('./lib/github-create-repo')

const defaultName = () => {
  const path = process.cwd().split('/')
  return path[path.length - 1]
}
const createIP = (name, message, store = false) => ({
  type: 'input',
  name, message, store
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
    this.npmInstall(devDependencies, {'saveDev': true})
    this.npmInstall(this.dependencies, {'save': true})
  }

  configuring () {
    mkdir.sync('./src')
  }

  createRepo () {
    return githubCreateRepo({
      generator: this,
      username: this.githubUser,
      password: this.githubPassword,
      name: this.name
    })
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
      {
        type: 'input',
        name: 'name',
        message: 'Application\'s name?',
        default: defaultName(),
        validate: validatePackageName(this)
      },
      createIP('description', 'Description?'),
      createIP('githubUser', 'Your Github account?', true),
      {
        type: 'password',
        name: 'githubPassword',
        message: 'Your Github password (to create a repo)'
      },
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
