exports.getFixedInvestment = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      device_id: { required: true, type: 'string' },
      name: { required: true, type: 'string' },
      type: { required: true, type: 'string' }
    }, query)
    // 定投不用check
    await ctx.services.user.addCustomerActive(data.name)
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
      name: { required: true, type: 'string' },
      type: { required: true, type: 'string' }
    }, query)
    await ctx.services.user.addCustomerActive(data.name)
    await ctx.services.auth.checkCustomer(data)
    const res = await ctx.services.indexFundBand.getBand(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
