const Proxy = require('../proxy')
const md5 = require('md5')
const moment = require('moment')

const MarketOpenProxy = Proxy.MarketOpen
const tableFields = require('../models/tableFields')

const UserProxy = Proxy.User
const UserDayProxy = Proxy.UserDay

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

exports.updateUser = async function (query, data) {
  return UserProxy.update(query, data)
}

exports.getAdminUsers = async function (paging) {
  let queryOption = {
    roles: {
      $in: ['admin', 'test']
    }
  }
  const opt = {
    skip: paging.start,
    limit: paging.offset
  }
  const fetchData = await Promise.all([
    UserProxy.find(queryOption, opt),
    UserProxy.count(queryOption)
  ])
  const users = fetchData[0]
  return { list: users, count: fetchData[1] }
}

exports.addAdminUser = async function (data) {
  return UserProxy.newAndSave({
    // 昵称
    name: data.name,
    // 密码明文
    password_raw: data.password,
    // 密码
    password: md5(data.password),
    roles: [data.roles]
  })
}

exports.deleteAdminUser = async function (data) {
  return UserProxy.delete({
    _id: data.user_id
  })
}

exports.getCustomers = async function (query, paging) {
  const opt = {
    skip: paging.start,
    limit: paging.offset,
    sort: {
      create_at: -1
    }
  }
  let queryOption = {
    roles: {
      $in: ['user']
    }
  }
  if (query.name) {
    queryOption.name = query.name
  }
  if (query.status) {
    queryOption.status = query.status
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

exports.addCustomer = async function (data) {
  return UserProxy.newAndSave({
    // 昵称
    name: data.name,
    can_use_day: data.can_use_day,
    roles: ['user']
  })
}

exports.getCustomer = async function (data) {
  return UserProxy.findOne({
    _id: data.id
  })
}

exports.getCustomerByName = async function (data) {
  return UserProxy.findOne({
    name: data.name
  })
}

exports.updateCustomer = async function (data) {
  const customerUpdateModel = tableFields.createUpdateModel(
    tableFields.customer.update,
    data
  )
  return UserProxy.update({
    _id: data._id
  }, {
    ...customerUpdateModel
  })
}

exports.addTodayQuery = async function (data) {
  const user = await UserProxy.findOne({ name: data.name })
  if (!user) {
    throw new Error('此微信号尚未注册账户')
  }
  return UserProxy.update({
    _id: user._id
  }, {
    today_query: user.today_query + 1
  })
}

exports.updateCustomerTodayHistory = async function () {
  let queryOption = {
    roles: {
      $in: ['user']
    }
  }
  let opList = []
  const fetchData = await Promise.all([
    // 今天注册的用户统计
    UserProxy.count({
      roles: {
        $in: ['user']
      },
      create_at: {
        $gte: moment().format('YYYY-MM-DD')
      }
    }),
    UserProxy.count({
      roles: {
        $in: ['user']
      },
      today_query: {
        $gt: 0
      }
    })
  ])
  await UserDayProxy.newAndSave({
    detail: {
      today_register_user: fetchData[0],
      today_query_user: fetchData[1]
    },
    date: moment('YYYY-MM-DD')
  })
  const users = await UserProxy.find(queryOption)
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    opList.push(
      UserProxy.update({
        _id: user._id
      }, {
        history_login: user.history_login + user.today_login,
        history_query: user.history_query + user.today_query,
        today_query: 0,
        today_login: 0
      })
    )
  }
  return Promise.all(opList)
}

exports.updateCustomerCanUseDay = async function () {
  let queryOption = {
    roles: {
      $in: ['user']
    }
  }
  let opList = []
  const users = await UserProxy.find(queryOption)
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    // 需要计算今日
    if (user.if_count_day) {
      if (user.can_use_day > 0) {
        opList.push(
          UserProxy.update({
            _id: user._id
          }, {
            can_use_day: user.can_use_day - 1
          })
        )
      }
    } else {
      // 不需要计算今日
      opList.push(
        UserProxy.update({
          _id: user._id
        }, {
          if_count_day: true
        })
      )
    }
  }
  return Promise.all(opList)
}

exports.addCustomerActive = async function (name) {
  const user = await UserProxy.findOne({ name })
  if (user.last_active_day) {
    // 不是同一天，说明在新的一天活跃了
    if (!moment().isSame(user.last_active_day, 'day')) {
      return UserProxy.update({ name }, {
        last_active_day: Date.now(),
        active_days: user.active_days + 1
      })
    } else {
      return UserProxy.update({ name }, {
        last_active_day: Date.now()
      })
    }
  } else {
    // 不是注册的同一天
    if (!moment().isSame(user.create_at, 'day')) {
      // 新值
      return UserProxy.update({ name }, {
        last_active_day: Date.now(),
        active_days: 1
      })
    } else {
      // 同一天不能加天数
      return UserProxy.update({ name }, {
        last_active_day: Date.now()
      })
    }
  }
}

exports.giveCanUseDayToCustomers = async function (data) {
  let queryOption = {
    roles: {
      $in: ['user']
    }
  }
  let opList = []
  const users = await UserProxy.find(queryOption)
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    // 奖励过得不奖了, 大的节日可以改代码大家都奖
    if (!user.if_reward) {
      opList.push(
        // 试用的另算，这是特别福利
        UserProxy.update({
          _id: user._id
        }, {
          buy_type: '波段',
          can_use_day: user.can_use_day + data.day
        })
      )
    }
  }
  return Promise.all(opList)
}
