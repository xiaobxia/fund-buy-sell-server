/**
 * 邮件发送日志分页获取
 * @param ctx
 * @returns {Promise<void>}
 */
exports.emailSendLogGetRecords = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      current: { type: 'int', required: true },
      pageSize: { type: 'int', required: true },
      beginTime: { required: false, type: 'string' },
      endTime: { required: false, type: 'string' }
    }, query)
    let paging = ctx.paging(data.current, data.pageSize)
    const records = await ctx.services.emailSendLog.getRecords(data, paging)
    ctx.body = ctx.resuccess(records)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 邀请日志分页获取
 * @param ctx
 * @returns {Promise<void>}
 */
exports.invitationLogGetRecords = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      current: { type: 'int', required: true },
      pageSize: { type: 'int', required: true },
      beginTime: { required: false, type: 'string' },
      endTime: { required: false, type: 'string' }
    }, query)
    let paging = ctx.paging(data.current, data.pageSize)
    const records = await ctx.services.invitationLog.getRecords(data, paging)
    ctx.body = ctx.resuccess(records)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
