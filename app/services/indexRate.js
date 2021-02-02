const moment = require('moment')
const axios = require('axios')
const Proxy = require('../proxy')
const indexList = require('../const/indexList')

const IndexRateProxy = Proxy.IndexRate

const qUrl = 'http://8.136.27.152:3006/stockData/'

/**
 * 更新信号
 * @returns {Promise<*>}
 */
exports.updateRecord = async function () {
  const codes = indexList.map((v)=>{
    return v.code
  })
  const res = await axios.post(`${qUrl}getStockTodayTenxunByCodes`, {
    codes: codes
  })
  if (res.data.length) {
    const item = res.data[0]
    const date = moment(item.tradeTime).format('YYYY-MM-DD')
    const rawRecord = await IndexRateProxy.findOne({trade_date: date})
    if (rawRecord) {
      return IndexRateProxy.update({
        trade_date: date
      }, {record: res.data})
    } else {
      return IndexRateProxy.newAndSave({
        trade_date: date,
        record: res.data
      })
    }
  }
}

/**
 * 获取最新信号
 * @returns {Promise<*>}
 */
exports.getLastRecord = async function () {
  const opt = {
    sort: '-trade_date',
    limit: 1
  }
  const records = await IndexRateProxy.find({}, opt)
  if (records[0]) {
    return records[0]
  } else {
    return {}
  }
}

/**
 * 获取最近两天的信号
 * @returns {Promise<*>}
 */
exports.getLastTRecord = async function () {
  const opt = {
    sort: '-trade_date',
    limit: 2
  }
  return IndexRateProxy.find({}, opt)
}

/**
 * 通过日期获取
 * @param query
 * @returns {Promise<*>}
 */
exports.getRecordsByStart = async function (query) {
  const opt = {
    sort: 'trade_date'
  }
  return IndexRateProxy.find({
    trade_date: {
      $gte: moment(query.start).format('YYYY-MM-DD')
    }
  }, opt)
}
