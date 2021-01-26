const axios = require('axios')
const qs = require('qs')
const reqlib = require('app-root-path').require
const config = reqlib('/config/index')

const stockAddress = `${config.serverIp}:3006`

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
