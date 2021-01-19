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

/**
 * 通过邮箱获取用户
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getUserByEmail = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      email: { required: true, type: 'string' }
    }, query)
    await ctx.services.user.getUserByEmail(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 添加vip时间
 * @param ctx
 * @returns {Promise<void>}
 */
exports.addUserVipDays = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      email: { required: true, type: 'string' },
      days: { required: true, type: 'int' }
    }, query)
    await ctx.services.user.addUserVipDays(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
