const tokenRes = [
  { field: 'name' },
  { field: 'roles' },
  { field: '_id' }
]
/**
 * 注册
 * @param ctx
 * @returns {Promise<void>}
 */
exports.register = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      name: { required: true, type: 'string' },
      password: { required: true, type: 'string' },
      email: { required: true, type: 'string' },
      platform: { required: true, type: 'string' }
    }, query)
    const userRaw = await ctx.services.auth.register(ctx.queryDataFilter(data, 'platform'))
    const user = ctx.formatFields(tokenRes, userRaw)
    // 登录在线时间
    const keepDay = 7
    const token = ctx.token.sign(user, 60 * 60 * 24 * keepDay)
    // 添加注册日志
    ctx.services.log.addLogAudit({
      log_type: 'register',
      platform: data.platform,
      user_id: userRaw._id,
      user_name: userRaw.name
    })
    ctx.body = ctx.resuccess({
      token,
      ...user
    })
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.customerLogin = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      device_id: { required: true, type: 'string' },
      name: { required: true, type: 'string' },
      password: { required: true, type: 'string' }
    }, query)
    const userRaw = await ctx.services.auth.customerLogin(data)
    const user = ctx.formatFields(tokenRes, userRaw)
    // 登录在线时间
    const keepDay = 365
    const token = ctx.token.sign(user, 60 * 60 * 24 * keepDay)
    ctx.body = ctx.resuccess({
      ...user,
      token
    })
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.customerRegister = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      device_id: { required: true, type: 'string' },
      name: { required: true, type: 'string' },
      password: { required: true, type: 'string' }
    }, query)
    const userRaw = await ctx.services.auth.customerRegister(data)
    const user = ctx.formatFields(tokenRes, userRaw)
    // 登录在线时间
    const keepDay = 365
    const token = ctx.token.sign(user, 60 * 60 * 24 * keepDay)
    ctx.body = ctx.resuccess({
      ...user,
      token
    })
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.checkCustomer = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      device_id: { required: true, type: 'string' },
      name: { required: true, type: 'string' },
      type: { required: true, type: 'string' }
    }, query)
    await ctx.services.auth.checkCustomer(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 登录
 * @param ctx
 * @returns {Promise<void>}
 */
exports.login = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      account: { required: true, type: 'string' },
      password: { required: true, type: 'string' },
      platform: { required: true, type: 'string' }
    }, query)
    const userRaw = await ctx.services.auth.login(data.account, data.password)
    const user = ctx.formatFields(tokenRes, userRaw)
    // 登录在线时间
    const keepDay = 20
    const token = ctx.token.sign(user, 60 * 60 * 24 * keepDay)
    // 添加登录日志
    ctx.services.log.addLogAudit({
      log_type: 'login',
      platform: data.platform,
      user_id: userRaw._id,
      user_name: userRaw.name
    })
    ctx.body = ctx.resuccess({
      ...user,
      token
    })
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 检查登录状态
 * @param ctx
 * @returns {Promise<void>}
 */
exports.checkLogin = async function (ctx) {
  const token = ctx.query.token
  if (token) {
    try {
      const tokenRaw = ctx.token.verify(token)
      const user = ctx.formatFields(tokenRes, tokenRaw)
      await ctx.services.user.addCustomerActive(user.name)
      ctx.body = ctx.resuccess({
        ...user,
        isLogin: true,
        token
      })
    } catch (err) {
      ctx.body = ctx.resuccess({
        isLogin: false
      })
    }
  } else {
    ctx.body = ctx.resuccess({
      isLogin: false
    })
  }
}

/**
 * 退出登录
 * @param ctx
 * @returns {Promise<void>}
 */
exports.logout = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      token: { required: false, type: 'string' },
      platform: { required: true, type: 'string' }
    }, query)
    const tokenRaw = ctx.token.verify(data.token)
    // 添加退出登录日志
    ctx.services.log.addLogAudit({
      log_type: 'logout',
      platform: data.platform,
      user_id: tokenRaw._id,
      user_name: tokenRaw.name
    })
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.addCustomer = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      // 微信号
      name: { required: true, type: 'string' }
    }, query)
    const userRaw = await ctx.services.auth.register(ctx.queryDataFilter(data, 'platform'))
    const user = ctx.formatFields(tokenRes, userRaw)
    // 登录在线时间
    const keepDay = 7
    const token = ctx.token.sign(user, 60 * 60 * 24 * keepDay)
    ctx.body = ctx.resuccess({
      token,
      ...user
    })
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.resetPassword = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      device_id: { required: true, type: 'string' },
      name: { required: true, type: 'string' },
      password: { required: true, type: 'string' }
    }, query)
    await ctx.services.auth.resetPassword(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
