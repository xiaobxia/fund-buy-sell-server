const moment = require('moment')
const Proxy = require('../proxy')
const webDataUtil = require('../util/webDataUtil')

const MarketOpenProxy = Proxy.MarketOpen

/**
 * 检查开市
 * @returns {Promise<*>}
 */
exports.verifyMarketOpening = async function (services) {
  const nowDay = moment().format('YYYY-MM-DD')
  const data = await webDataUtil.getStockTodayDongfang({ code: 'sh000001' })
  const record = await MarketOpenProxy.findOne({ date: nowDay })
  const open = moment().isSame(data.tradeTime, 'day')
  if (record) {
    return MarketOpenProxy.update({ date: nowDay }, {
      open
    })
  } else {
    // 立马扣减
    await services.user.deleteVipDays()
    return MarketOpenProxy.newAndSave({
      date: nowDay,
      open
    })
  }
}

/**
 * 获取开市
 * @returns {Promise<*>}
 */
exports.getMarketOpen = async function () {
  const nowDay = moment().format('YYYY-MM-DD')
  return MarketOpenProxy.findOne({ date: nowDay })
}
