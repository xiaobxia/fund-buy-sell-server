const reqlib = require('app-root-path').require
const localConfig = reqlib('/config')
const axios = require('axios')
const qs = require('qs')

const fundAddress = localConfig.fundDataAddress
const stockAddress = localConfig.stockDataAddress

function makeFundUrl (path) {
  return `${fundAddress}/${path}`
}

function axiosGetFund (url, query, options) {
  let queryString = ''
  if (query) {
    query.timestamp = new Date().getTime()
    queryString = qs.stringify(query)
  } else {
    queryString = qs.stringify({ timestamp: new Date().getTime() })
  }
  return axios.get(makeFundUrl(url + (queryString ? '?' + queryString : '')), options).then(data => data.data)
}

function makeStockUrl (path) {
  return `${stockAddress}/${path}`
}

function axiosGetStock (url, query, options) {
  let queryString = ''
  if (query) {
    query.timestamp = new Date().getTime()
    queryString = qs.stringify(query)
  } else {
    queryString = qs.stringify({ timestamp: new Date().getTime() })
  }
  return axios.get(makeStockUrl(url + (queryString ? '?' + queryString : '')), options).then(data => data.data)
}

exports.getFundBuySellRate = function (data) {
  return axiosGetFund('fundData/getFundBuySellRate', {
    code: data.code
  })
}

exports.getFundsInfoHaomai = function () {
  return axiosGetFund('fundData/getFundsInfoHaomai')
}

exports.getRecentNetValue = function (data) {
  return axiosGetFund('fundData/getRecentNetValue', {
    code: data.code,
    days: data.days || 200
  })
}

exports.getFundsInfoAll = function () {
  return axiosGetFund('fundData/getFundsInfoAll')
}

exports.getFundsInfo = function () {
  return axiosGetFund('fundData/getFundsInfo')
}

exports.getFundInfo = function (data) {
  return axiosGetFund('fundData/getFundInfo', {
    code: data.code
  })
}

exports.getStockRate = function (data) {
  return axiosGetStock('stockData/getStockRate', {
    start: data.start,
    way: data.way || '东方',
    code: data.code
  })
}

exports.getTradingDays = function (data) {
  return axiosGetStock('stockData/getTradingDays', {
    days: data.days,
    way: data.way || '东方'
  })
}

exports.getLastTradingDay = function (data) {
  data = data || { way: '东方' }
  return axiosGetStock('stockData/getLastTradingDay', {
    way: data.way
  })
}

exports.getStockTodayTenxun = function (data) {
  return axiosGetStock('stockData/getStockTodayTenxun', {
    code: data.code
  })
}

exports.getStockAllTenxun = function (data) {
  return axiosGetStock('stockData/getStockAllTenxun', {
    code: data.code,
    days: data.days
  })
}

exports.getStockTodayDongfang = function (data) {
  return axiosGetStock('stockData/getStockTodayDongfang', {
    code: data.code
  })
}

exports.getStockAllDongfang = function (data) {
  return axiosGetStock('stockData/getStockAllDongfang', {
    code: data.code,
    days: data.days
  })
}

exports.getStockTodayXueqiu = function (data) {
  return axiosGetStock('stockData/getStockTodayXueqiu', {
    code: data.code
  })
}

exports.getStockAllXueqiu = function (data) {
  return axiosGetStock('stockData/getStockAllXueqiu', {
    code: data.code,
    days: data.days
  })
}
