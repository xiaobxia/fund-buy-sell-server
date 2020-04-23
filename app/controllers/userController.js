/**
 * 修改登录密码
 * @param ctx
 * @returns {Promise<void>}
 */
exports.newPassword = async function (ctx) {
  const query = ctx.request.body
  try {
    const tokenRaw = ctx.tokenRaw
    const data = ctx.validateData({
      oldPassword: { required: true, type: 'string' },
      newPassword: { required: true, type: 'string' }
    }, query)
    const userRaw = await ctx.services.user.getUserByName(tokenRaw.name)
    await ctx.services.user.newPassword({
      name: userRaw.name,
      ...data
    })
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
