exports.getRecords = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      current: { type: 'int', required: true },
      pageSize: { type: 'int', required: true },
      beginTime: { required: false, type: 'string' },
      endTime: { required: false, type: 'string' }
    }, query)
    let paging = ctx.paging(data.current, data.pageSize)
    const records = await ctx.services.emailActive.getRecords(data, paging)
    ctx.body = ctx.resuccess(records)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
