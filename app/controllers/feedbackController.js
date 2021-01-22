/**
 * 添加记录
 * @param ctx
 * @returns {Promise<void>}
 */
exports.addFeedback = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      email: { type: 'string', required: true },
      content: { type: 'string', required: false }
    }, query)
    await ctx.services.feedback.addFeedback(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 分页获取
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getRecords = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      current: { type: 'int', required: true },
      pageSize: { type: 'int', required: true },
      beginTime: { required: false, type: 'string' },
      endTime: { required: false, type: 'string' },
      search: { required: false, type: 'string' }
    }, query)
    let paging = ctx.paging(data.current, data.pageSize)
    const records = await ctx.services.feedback.getRecords(data, paging)
    ctx.body = ctx.resuccess(records)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
