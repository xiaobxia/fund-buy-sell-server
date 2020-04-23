const env = process.env.NODE_ENV
const isDev = env !== 'prod'
const base = require('./base')
const dev = require('./dev')
const prod = require('./prod')

let envConfig = prod

if (isDev) {
  envConfig = dev
}

module.exports = {
  ...base,
  ...envConfig
}
