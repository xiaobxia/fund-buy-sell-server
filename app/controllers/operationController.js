exports.getFixedInvestment = async function (ctx) {
  try {
    const res = await ctx.services.indexFund.getFixedInvestment()
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getBand = async function (ctx) {
  try {
    const res = await ctx.services.indexFundBand.getBand()
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
