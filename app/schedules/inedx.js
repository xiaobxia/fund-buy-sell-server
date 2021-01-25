const env = process.env.NODE_ENV
const isDev = env === 'dev'
if (!isDev) {
  exports.deleteVipDays = require('./deleteVipDays')
  exports.marketOpen = require('./marketOpen')
}
