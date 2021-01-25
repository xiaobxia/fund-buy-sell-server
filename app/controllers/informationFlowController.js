/**
 * 更新信息流信息
 * @param ctx
 * @returns {Promise<void>}
 */
exports.updateInfoFlow = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      content: { type: 'string', required: true },
      is_vip: { type: 'boolean', required: true },
      id: { type: 'string', required: false }
    }, query)
    await ctx.services.informationFlow.updateInfoFlow(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 点赞
 * @param ctx
 * @returns {Promise<void>}
 */
exports.addLike = async function (ctx) {
  const query = ctx.request.body
  try {
    const tokenRaw = ctx.tokenRaw
    const data = ctx.validateData({
      info_id: { type: 'string', required: true }
    }, query)
    await ctx.services.informationFlow.addLike({
      ...data,
      user_id: tokenRaw.id
    })
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 取消点赞
 * @param ctx
 * @returns {Promise<void>}
 */
exports.disLike = async function (ctx) {
  const query = ctx.request.body
  try {
    const tokenRaw = ctx.tokenRaw
    const data = ctx.validateData({
      info_id: { type: 'string', required: true }
    }, query)
    await ctx.services.informationFlow.disLike({
      ...data,
      user_id: tokenRaw.id
    })
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 获取用户信息流
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getUserInfoFlow = async function (ctx) {
  const query = ctx.query
  try {
    const tokenRaw = ctx.tokenRaw
    const data = ctx.validateData({
      current: { type: 'int', required: true },
      pageSize: { type: 'int', required: true }
    }, query)
    let paging = ctx.paging(data.current, data.pageSize)
    const records = await ctx.services.informationFlow.getUserInfoFlow({
      user_id: tokenRaw.id
    }, paging)
    ctx.body = ctx.resuccess(records)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 获取管理员信息流
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getAdminInfoFlow = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      current: { type: 'int', required: true },
      pageSize: { type: 'int', required: true },
      beginTime: { required: false, type: 'string' },
      endTime: { required: false, type: 'string' },
      is_vip: { required: false, type: 'boolean' },
      search: { required: false, type: 'string' }
    }, query)
    let paging = ctx.paging(data.current, data.pageSize)
    const records = await ctx.services.informationFlow.getAdminInfoFlow(data, paging)
    ctx.body = ctx.resuccess(records)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 删除
 * @param ctx
 * @returns {Promise<void>}
 */
exports.deleteRecord = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      info_id: { type: 'string', required: true }
    }, query)
    await ctx.services.informationFlow.deleteRecord(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
