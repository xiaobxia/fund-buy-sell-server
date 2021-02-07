/**
 * 获取用户统计
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getUserCount = async function (ctx) {
  try {
    const res = await ctx.services.user.getUserCount()
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
