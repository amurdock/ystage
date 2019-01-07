const { resolve } = require('path')

const rootDir = process.cwd()
const coverageDirectory = resolve(rootDir, '.coverage')
const testURL = 'http://localhost/'
const coverageThreshold = {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}

module.exports = {
  coverageDirectory,
  coverageThreshold,
  testURL,
  rootDir
}
