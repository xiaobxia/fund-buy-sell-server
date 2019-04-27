const webDataUtil = require('../util/webDataUtil')

exports.getStockRate = async function (ctx) {
  try {
    const res = await webDataUtil.getStockRate(ctx.query)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getTradingDays = async function (ctx) {
  try {
    const res = await webDataUtil.getTradingDays(ctx.query)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getLastTradingDay = async function (ctx) {
  try {
    const res = await webDataUtil.getLastTradingDay(ctx.query)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getStockTodayTenxun = async function (ctx) {
  try {
    const res = await webDataUtil.getStockTodayTenxun(ctx.query)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getStockAllTenxun = async function (ctx) {
  try {
    const res = await webDataUtil.getStockAllTenxun(ctx.query)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getStockTodayDongfang = async function (ctx) {
  try {
    const res = await webDataUtil.getStockTodayDongfang(ctx.query)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getStockAllDongfang = async function (ctx) {
  try {
    const res = await webDataUtil.getStockAllDongfang(ctx.query)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getStockTodayXueqiu = async function (ctx) {
  try {
    const res = await webDataUtil.getStockTodayXueqiu(ctx.query)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getStockAllXueqiu = async function (ctx) {
  try {
    const res = await webDataUtil.getStockAllXueqiu(ctx.query)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
