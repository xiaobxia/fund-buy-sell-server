const moment = require('moment')
const Proxy = require('../proxy')
const webDataUtil = require('../util/webDataUtil')

const MarketOpenProxy = Proxy.MarketOpen

exports.verifyMarketOpening = async function () {
  const nowDay = moment().format('YYYY-MM-DD')
  const data = await webDataUtil.getStockTodayDongfang({ code: 'sh000001' })
  const record = await MarketOpenProxy.findOne({ date: nowDay })
  const open = moment().isSame(data.tradeTime, 'day')
  if (record) {
    return MarketOpenProxy.update({ date: nowDay }, {
      open
    })
  } else {
    return MarketOpenProxy.newAndSave({
      date: nowDay,
      open
    })
  }
}

exports.initMarketOpening = async function () {
  const res = await webDataUtil.getTradingDays({ days: 300 })
  const dateList = res.tradingDay
  const start = dateList[0]
  const end = dateList[dateList.length - 1]
  const len = parseInt((dateList.length / 5) * 8)
  let addList = []
  for (let i = 0; i < len; i++) {
    let day = moment(start).add(i, 'day').format('YYYY-MM-DD')
    if (day !== end) {
      addList.push(
        MarketOpenProxy.newAndSave({
          date: day,
          open: dateList.indexOf(day) !== -1
        })
      )
    } else {
      break
    }
  }
  return Promise.all(addList)
}

exports.getTodayMarketOpen = async function () {
  const nowDay = moment().format('YYYY-MM-DD')
  const record = await MarketOpenProxy.findOne({ date: nowDay })
  if (record) {
    return record.open
  } else {
    return false
  }
}
