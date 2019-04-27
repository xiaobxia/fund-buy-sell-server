const moment = require('moment')
const util = require('../util')
const webDataUtil = require('../util/webDataUtil')

const numberUtil = util.numberUtil

/**
 * 初始化数据
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.initStockPrice = async function (ctx) {
  const query = ctx.query
  const stockPriceService = ctx.services.stockPrice
  try {
    const data = ctx.validateData({
      code: { required: true },
      count: { required: true, type: 'number' }
    }, query)
    await stockPriceService.initStockPrice(data.code, data.count)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
/**
 * 添加数据
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.addStockPrice = async function (ctx) {
  const query = ctx.query
  const stockPriceService = ctx.services.stockPrice
  try {
    const data = ctx.validateData({
      code: { required: true }
    }, query)
    await stockPriceService.addStockPrice(data.code)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 获取某天数据
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getStockPrice = async function (ctx) {
  const query = ctx.query
  const stockPriceService = ctx.services.stockPrice
  try {
    const data = ctx.validateData({
      code: { required: true },
      date: { required: true }
    }, query)
    const res = await stockPriceService.getStockPrice({
      code: data.code,
      trade_date: moment(data.date).format('YYYYMMDD')
    })
    ctx.body = ctx.resuccess(res || {})
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getStockPriceRate = async function (ctx) {
  const query = ctx.query
  const stockPriceService = ctx.services.stockPrice
  try {
    const data = ctx.validateData({
      code: { type: 'string', required: true },
      start: { type: 'string', required: true }
    }, query)
    const res = await stockPriceService.getStockPriceRate(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getStockPriceRateByLocal = async function (ctx) {
  const query = ctx.query
  const stockPriceService = ctx.services.stockPrice
  try {
    const data = ctx.validateData({
      code: { type: 'string', required: true },
      start: { type: 'string', required: true }
    }, query)
    const res = await stockPriceService.getStockPrice({
      code: data.code,
      trade_date: moment(data.start).format('YYYYMMDD')
    })
    const resData = await webDataUtil.getStockTodayDongfang({
      code: data.code
    })
    ctx.body = ctx.resuccess({
      startClose: res.close,
      startDate: res.trade_date,
      nowClose: parseFloat(resData.close),
      rate: numberUtil.countDifferenceRate(parseFloat(resData.close), res.close)
    })
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getStockPriceKline = async function (ctx) {
  const query = ctx.query
  const stockPriceService = ctx.services.stockPrice
  try {
    const data = ctx.validateData({
      code: { type: 'string', required: true },
      start: { type: 'string', required: true }
    }, query)
    const res = await stockPriceService.getStockPriceKline(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getStockPriceMonthRate = async function (ctx) {
  const query = ctx.query
  const stockPriceService = ctx.services.stockPrice
  try {
    const data = ctx.validateData({
      code: { type: 'string', required: true },
      start: { type: 'string', required: true }
    }, query)
    const res = await stockPriceService.getStockPriceMonthRate(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getStockPriceNowMonthRate = async function (ctx) {
  const query = ctx.query
  const stockPriceService = ctx.services.stockPrice
  try {
    const data = ctx.validateData({
      code: { type: 'string', required: true }
    }, query)
    const res = await stockPriceService.getStockPriceNowMonthRate(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getStockPriceNowYearRate = async function (ctx) {
  const query = ctx.query
  const stockPriceService = ctx.services.stockPrice
  try {
    const data = ctx.validateData({
      code: { type: 'string', required: true }
    }, query)
    const res = await stockPriceService.getStockPriceNowYearRate(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
