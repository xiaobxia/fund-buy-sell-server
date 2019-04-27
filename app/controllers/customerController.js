exports.getCustomerByName = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      name: { type: 'string', required: true }
    }, query)
    const res = await ctx.services.user.getCustomerByName(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.addTodayQuery = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      name: { type: 'string', required: true }
    }, query)
    const res = await ctx.services.user.addTodayQuery(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
