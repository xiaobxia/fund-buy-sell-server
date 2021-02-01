/**
 * 更新信号
 * @param ctx
 * @returns {Promise<void>}
 */
exports.updateSignal = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      trade_date: { type: 'string', required: true },
      record: { type: 'string', required: false }
    }, query)
    await ctx.services.riskSignal.updateSignal(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 获取最新信号
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getLastSignal = async function (ctx) {
  try {
    const record = await ctx.services.riskSignal.getLastSignal()
    ctx.body = ctx.resuccess(record)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 获取最近两天的信号，加入鉴权
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getLastTSignal = async function (ctx) {
  try {
    const record = await ctx.services.riskSignal.getLastTSignal()
    ctx.body = ctx.resuccess({
      record
    })
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 根据天数获取
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getSignalsByDays = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      days: { type: 'int', required: true }
    }, query)
    const record = await ctx.services.riskSignal.getSignalsByDays(data)
    ctx.body = ctx.resuccess(record)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 通过日期获取
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getSignalsByStart = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      start: { type: 'string', required: true }
    }, query)
    const record = await ctx.services.riskSignal.getSignalsByStart(data)
    ctx.body = ctx.resuccess(record)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
