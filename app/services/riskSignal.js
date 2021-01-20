const moment = require('moment')
const Proxy = require('../proxy')

const RiskSignalProxy = Proxy.RiskSignal

exports.getSignal = async function (query, paging) {
}

/**
 * 更新信号
 * @param data
 * @returns {Promise<*>}
 */
exports.updateSignal = async function (data) {
  const updateData = {}
  if (data.record) {
    updateData.record = JSON.parse(data.record)
  }
  const RiskSignal = await RiskSignalProxy.findOne({
    trade_date: data.trade_date
  })
  if (RiskSignal) {
    return RiskSignalProxy.update({
      trade_date: data.trade_date
    }, updateData)
  } else {
    return RiskSignalProxy.newAndSave({
      trade_date: data.trade_date,
      ...updateData
    })
  }
}

/**
 * 获取最新信号
 * @returns {Promise<*>}
 */
exports.getLastSignal = async function () {
  const opt = {
    sort: '-trade_date',
    limit: 1
  }
  const records = await RiskSignalProxy.find({}, opt)
  if (records[0]) {
    return records[0]
  } else {
    return {}
  }
}

/**
 * 根据天数获取
 * @param query
 * @returns {Promise<*>}
 */
exports.getSignalsByDays = async function (query) {
  const opt = {
    sort: '-trade_date',
    limit: query.days
  }
  return RiskSignalProxy.find({
  }, opt)
}

/**
 * 通过日期获取
 * @param query
 * @returns {Promise<*>}
 */
exports.getSignalsByStart = async function (query) {
  const opt = {
    sort: 'trade_date'
  }
  return RiskSignalProxy.find({
    trade_date: {
      $gte: moment(query.start).format('YYYY-MM-DD')
    }
  }, opt)
}
