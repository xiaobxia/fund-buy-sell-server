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
    const token = ctx.header.token
    const user = await ctx.services.user.getUserByEmail(tokenRaw.email)
    if (user.token !== token) {
      ctx.body = ctx.refail({
        code: '401',
        message: '该账户已在其他设备登录！'
      })
      return
    }
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
    const user = await ctx.services.user.getUserByEmail(data.email)
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
    await ctx.services.user.addUserVipDays(data, ctx.services)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 减少vip时间
 * @param ctx
 * @returns {Promise<void>}
 */
exports.deleteVipDays = async function (ctx) {
  try {
    const marketOpen = await ctx.services.marketOpen.getMarketOpen()
    if (marketOpen && marketOpen.open) {
      await ctx.services.user.deleteVipDays()
    }
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 查询开市
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getMarketOpen = async function (ctx) {
  try {
    const marketOpen = await ctx.services.marketOpen.getMarketOpen()
    let open = false
    if (marketOpen && marketOpen.open) {
      open = true
    }
    ctx.body = ctx.resuccess({
      open
    })
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 生成支付码
 * @param ctx
 * @returns {Promise<void>}
 */
exports.createPayCode = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      email: { required: true, type: 'string' }
    }, query)
    const code = await ctx.services.payCode.createPayCode(data, ctx.services)
    ctx.body = ctx.resuccess({
      code
    })
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 获取最近两天的信号，加入鉴权
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getLastTSignal = async function (ctx) {
  try {
    const tokenRaw = ctx.tokenRaw
    const user = await ctx.services.user.getUserByEmail(tokenRaw.email)
    let record = []
    if (user.vip_days) {
      record = await ctx.services.riskSignal.getLastTSignal()
    }
    ctx.body = ctx.resuccess({
      record
    })
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 获取最新的信号，加入鉴权
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getLastBSTSignal = async function (ctx) {
  try {
    const tokenRaw = ctx.tokenRaw
    const user = await ctx.services.user.getUserByEmail(tokenRaw.email)
    let record = {}
    if (user.vip_days) {
      record = await ctx.services.buySellSignal.getLastSignal()
    }
    ctx.body = ctx.resuccess(record)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 获取指数涨跌幅，加入鉴权
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getIndexRate = async function (ctx) {
  try {
    const tokenRaw = ctx.tokenRaw
    const user = await ctx.services.user.getUserByEmail(tokenRaw.email)
    let record = []
    if (user.vip_days) {
      record = await ctx.services.indexRate.getLastRecord()
    }
    ctx.body = ctx.resuccess(record)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
