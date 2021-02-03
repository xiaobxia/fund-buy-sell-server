const moment = require('moment')
const Proxy = require('../proxy')

const BuySellSignalProxy = Proxy.BuySellSignal

exports.getSignal = async function (query, paging) {

}

exports.updateSignal = async function (data) {
  const updateData = {}
  if (data.fix_record) {
    updateData.fix_record = JSON.parse(data.fix_record)
  }
  if (data.band_record) {
    updateData.band_record = JSON.parse(data.band_record)
  }
  const buySellSignal = await BuySellSignalProxy.findOne({
    trade_date: data.trade_date
  })
  if (buySellSignal) {
    return BuySellSignalProxy.update({
      trade_date: data.trade_date
    }, updateData)
  } else {
    return BuySellSignalProxy.newAndSave({
      trade_date: data.trade_date,
      ...updateData
    })
  }
}

exports.getLastSignal = async function () {
  const opt = {
    sort: '-trade_date',
    limit: 1
  }
  const records = await BuySellSignalProxy.find({}, opt)
  if (records[0]) {
    return records[0]
  } else {
    return {}
  }
}

exports.getLastTSignal = async function () {
  const opt = {
    sort: '-trade_date',
    limit: 2
  }
  return BuySellSignalProxy.find({}, opt)
}

exports.getSignalsByDays = async function (query) {
  const opt = {
    sort: '-trade_date',
    limit: query.days
  }
  return BuySellSignalProxy.find({
  }, opt)
}

exports.getSignalsByStart = async function (query) {
  const opt = {
    sort: 'trade_date'
  }
  return BuySellSignalProxy.find({
    trade_date: {
      $gte: moment(query.start).format('YYYY-MM-DD')
    }
  }, opt)
}
