const sysConsts = require('./sysConsts')
const errorConsts = require('./errorConsts')
const constant = require('./constant')

module.exports = {
  ...sysConsts,
  ...errorConsts,
  ...constant
}
