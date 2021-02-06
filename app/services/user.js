const Proxy = require('../proxy')

const UserProxy = Proxy.User

/**
 * 更新token
 * @param data
 * @returns {Promise<*>}
 */
exports.updateToken = async function (data) {
  const user = await UserProxy.findOne({ email: data.email })
  if (!user) {
    throw new Error('用户不存在')
  }
  return UserProxy.update({ email: data.email }, {
    token: data.token
  })
}

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
  // 创建时间
  if (query.beginTime) {
    queryOption.create_at = {
      $gte: query.beginTime,
      $lt: query.endTime
    }
  }
  // 模糊匹配
  if (query.search) {
    queryOption.email = new RegExp(query.search, 'i')
  }
  if (query.hasVip === 1) {
    queryOption.vip_days = {
      $gt: 0
    }
  }
  if (query.hasVip === 0) {
    queryOption.vip_days = {
      $lt: 1
    }
  }
  if (query.hasInviter === 1) {
    queryOption.inviter_email = {
      $exists: true
    }
  }
  if (query.hasInviter === 0) {
    queryOption.inviter_email = {
      $exists: false
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
    const err = new Error('用户不存在')
    err.code = '401'
    throw err
  }
  return user
}

/**
 * 添加vip时间
 * @param data
 * @param services
 * @returns {Promise<*>}
 */
exports.addUserVipDays = async function (data, services) {
  const email = data.email
  const days = data.days
  const user = await UserProxy.findOne({ email })
  if (!user) {
    throw new Error('用户不存在')
  } else {
    // 原本的天数
    const rawDays = user.vip_days
    const marketOpen = await services.marketOpen.getMarketOpen()
    let vipNoDelete = false
    // 是新加入的天数，才会有这个判断
    if (!rawDays) {
      if (marketOpen && marketOpen.open) {
        const date = new Date()
        const hour = date.getHours()
        if (hour >= 15) {
          vipNoDelete = true
        }
      } else {
        vipNoDelete = true
      }
    }
    const updateData = {
      vip_days: rawDays + days
    }
    // 原本是要扣减，现在不用扣减了才更新
    if (!user.vip_no_delete && vipNoDelete) {
      updateData.vip_no_delete = true
    }
    return UserProxy.update({ email }, updateData)
  }
}

/**
 * 减少vip时间
 * @returns {Promise<*>}
 */
exports.deleteVipDays = async function () {
  const userList = await UserProxy.find({ })
  let opList = []
  userList.forEach((user) => {
    const updateData = {}
    if (user.vip_no_delete) {
      // 清掉
      updateData.vip_no_delete = false
    } else {
      // 需要扣减
      if (user.vip_days) {
        updateData.vip_days = user.vip_days - 1
      }
    }
    if (Object.keys(updateData).length !== 0) {
      // 需要更新数据
      opList.push(UserProxy.update({ _id: user._id }, updateData))
    }
  })
  return Promise.all(opList)
}

/**
 * 更新活跃日期
 * @param email
 * @param today
 * @returns {Promise<*>}
 */
exports.updateActiveDate = async function (email, today) {
  return UserProxy.update({ email: email }, {
    active_date: today
  })
}
