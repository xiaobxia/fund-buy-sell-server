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
      password: { required: true, type: 'string' }
    }, query)
    const userRaw = await ctx.services.auth.register(data)
    const user = {
      name: userRaw.name,
      password: userRaw.password,
      roles: userRaw.roles
    }
    // 登录在线时间
    const keepDay = 7
    const token = ctx.token.sign(user, 60 * 60 * 24 * keepDay)
    // 添加注册日志
    ctx.body = ctx.resuccess({
      token,
      ...user
    })
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
      password: { required: true, type: 'string' }
    }, query)
    const userRaw = await ctx.services.auth.login(data.account, data.password)
    const user = {
      name: userRaw.name,
      password: userRaw.password,
      roles: userRaw.roles
    }
    // 登录在线时间
    const keepDay = 20
    const token = ctx.token.sign(user, 60 * 60 * 24 * keepDay)
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
      const user = {
        name: tokenRaw.name,
        password: tokenRaw.password,
        roles: tokenRaw.roles
      }
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
      token: { required: false, type: 'string' }
    }, query)
    const tokenRaw = ctx.token.verify(data.token)
    ctx.body = ctx.resuccess(tokenRaw)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 发送激活邮件
 * @param ctx
 * @returns {Promise<void>}
 */
exports.sendRegisterEmail = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      email: { required: true, type: 'string' }
    }, query)
    await ctx.services.auth.sendRegisterEmail(data.email)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
