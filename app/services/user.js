const Proxy = require('../proxy')

const UserProxy = Proxy.User

/**
 * 修改用户密码
 * @param data
 * @returns {Promise<*>}
 */
exports.newPassword = async function (data) {
  const user = await UserProxy.findOne({ name: data.name })
  if (!user) {
    throw new Error('用户不存在')
  }
  if (user.password !== data.oldPassword) {
    throw new Error('账户名或密码不正确')
  }
  return UserProxy.update({ name: data.name }, {
    password: data.newPassword
  })
}

/**
 * 分页获取记录
 * @param query
 * @param paging
 * @returns {Promise<{count: any, list: any}>}
 */
exports.getRecords = async function (query, paging) {
  const opt = {
    skip: paging.start,
    limit: paging.offset,
    sort: {
      create_at: -1
    }
  }
  let queryOption = {
  }
  if (query.beginTime) {
    queryOption.create_at = {
      $gte: query.beginTime,
      $lt: query.endTime
    }
  }
  const fetchData = await Promise.all([
    UserProxy.find(queryOption, opt),
    UserProxy.count(queryOption)
  ])
  const list = fetchData[0]
  return { list: list, count: fetchData[1] }
}

/**
 * 通过用户名获取用户
 * @param name
 * @returns {Promise<void>}
 */
exports.getUserByName = async function (name) {
  const user = await UserProxy.findOne({ name })
  if (!user) {
    throw new Error('用户不存在')
  }
  return user
}

/**
 * 通过邮箱获取用户
 * @param email
 * @returns {Promise<void>}
 */
exports.getUserByEmail = async function (email) {
  const user = await UserProxy.findOne({ email })
  if (!user) {
    throw new Error('用户不存在')
  }
  return user
}

/**
 * 添加vip时间
 * @param name
 * @returns {Promise<void>}
 */
exports.addUserVipDays = async function (data) {
  const email = data.email
  const days = data.days
  const user = await UserProxy.findOne({ email })
  if (!user) {
    throw new Error('用户不存在')
  } else {
    const rawDays = user.vip_days
    return UserProxy.update({ email }, {
      vip_days: rawDays + days
    })
  }
}
