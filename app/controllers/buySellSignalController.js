exports.updateSignal = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      trade_date: { type: 'string', required: true },
      fix_record: { type: 'string', required: false },
      band_record: { type: 'string', required: false }
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
