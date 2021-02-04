exports.updateSignal = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      trade_date: { type: 'string', required: true },
      fix_record: { type: 'string', required: false },
      band_record: { type: 'string', required: false },
      position: { type: 'number', required: false }
    }, query)
    await ctx.services.buySellSignal.updateSignal(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getLastSignal = async function (ctx) {
  try {
    const record = await ctx.services.buySellSignal.getLastSignal()
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
    const record = await ctx.services.buySellSignal.getLastTSignal()
    ctx.body = ctx.resuccess({
      record
    })
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getSignalsByDays = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      days: { type: 'int', required: true }
    }, query)
    const record = await ctx.services.buySellSignal.getSignalsByDays(data)
    ctx.body = ctx.resuccess(record)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getSignalsByStart = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      start: { type: 'string', required: true }
    }, query)
    const record = await ctx.services.buySellSignal.getSignalsByStart(data)
    ctx.body = ctx.resuccess(record)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
