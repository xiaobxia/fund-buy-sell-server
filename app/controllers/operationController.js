exports.getFixedInvestment = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      device_id: { required: true, type: 'string' },
      type: { required: true, type: 'string' }
    }, query)
    const res = await ctx.services.indexFund.getFixedInvestment(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getBand = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      device_id: { required: true, type: 'string' },
      type: { required: true, type: 'string' }
    }, query)
    const res = await ctx.services.indexFundBand.getBand(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getTodayRank = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      device_id: { required: true, type: 'string' }
    }, query)
    const res = await ctx.services.indexFundBand.getTodayRank(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getMonthRank = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      device_id: { required: true, type: 'string' }
    }, query)
    const res = await ctx.services.indexFundBand.getMonthRank(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getIndexValuation = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      device_id: { required: true, type: 'string' }
    }, query)
    const res = await ctx.services.indexFund.getIndexValuation(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
