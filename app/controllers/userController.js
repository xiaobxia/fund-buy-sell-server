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
 * 用户分页获取
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
      // 有vip（1：有，0：没有）
      hasVip: { required: false, type: 'int' },
      // 有邀请人（1：有，0：没有）
      hasInviter: { required: false, type: 'int' },
      // 邮箱搜索
      search: { required: false, type: 'string' }
    }, query)
    let paging = ctx.paging(data.current, data.pageSize)
    const records = await ctx.services.user.getRecords(data, paging)
    ctx.body = ctx.resuccess(records)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 通过令牌获取用户
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getUserByToken = async function (ctx) {
  try {
    const tokenRaw = ctx.tokenRaw
    const user = await ctx.services.user.getUserByEmail(tokenRaw.email)
    ctx.body = ctx.resuccess(user)
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
    const user = await ctx.services.user.getUserByEmail(data)
    ctx.body = ctx.resuccess(user)
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
