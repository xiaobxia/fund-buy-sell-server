exports.getUserStatistics = async function (ctx) {
  try {
    const res = await ctx.services.statistics.getUserStatistics()
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getUserDay = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      startTime: { required: false, type: 'string' },
      endTime: { required: false, type: 'string' }
    }, query)
    const userDays = await ctx.services.statistics.getUserDay(data)
    ctx.body = ctx.resuccess(userDays)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
