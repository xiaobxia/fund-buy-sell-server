const Proxy = require('../proxy')
const moment = require('moment')

const UserProxy = Proxy.User

/**
 * 登录
 * @param account
 * @param password
 * @returns {Promise<void>}
 */
exports.login = async function (account, password) {
  const user = await UserProxy.findOne({ name: account })
  if (!user) {
    throw new Error('用户不存在')
  }
  if (user.password === password) {
    return user
  } else {
    throw new Error('账户名或密码不正确')
  }
}

exports.customerLogin = async function (data) {
  const user = await UserProxy.findOne({ name: data.name })
  if (!user) {
    throw new Error('此手机号尚未注册账户')
  }
  if (user.password !== data.password) {
    throw new Error('密码错误')
  }
  await UserProxy.update({
    _id: user._id
  }, {
    today_login: user.today_login + 1
  })
  return user
}

exports.customerRegister = async function (data) {
  const user = await UserProxy.findOne({ name: data.name })
  if (user) {
    throw new Error('此手机号已注册账户')
  } else {
    return UserProxy.newAndSave({
      name: data.name,
      password: data.password,
      roles: ['user'],
      last_device_id: data.device_id,
      // 上一次使用该设备的时间
      last_device_time: Date.now(),
      // 注册就送
      buy_type: '波段',
      can_use_day: 10,
      if_count_day: false
    })
  }
}

exports.checkCustomer = async function (data) {
  const user = await UserProxy.findOne({ name: data.name })
  if (!user) {
    throw new Error('此手机号尚未注册账户')
  }
  if (user.buy_type) {
    if (user.can_use_day > 0) {
      if (user.buy_type === '定投' && data.type === 'band') {
        throw new Error('您尚未拥有波段策略')
      } else {
        // 验证设备id
        if (user.last_device_id) {
          if (user.last_device_id === data.device_id) {
            // 是同一个
            return true
          } else {
            // 不是同一个，5分钟以上没问题
            if (moment().diff(user.last_device_time, 'minutes') > 5) {
              return true
            } else {
              // 5分钟以内就要求重新登录
              // throw new Error('')
              return true
            }
          }
        } else {
          // 没有设备Id，直接用新的
          return UserProxy.update({ _id: user._id }, {
            last_device_id: data.device_id,
            last_device_time: Date.now()
          })
        }
      }
    } else {
      if (data.type === 'band') {
        throw new Error('您的套餐已过期')
      }
      // throw new Error('您的套餐已过期')
    }
  } else {
    if (data.type === 'fixedInvestment') {
      // throw new Error('您尚未拥有定投策略')
    } else {
      throw new Error('您尚未拥有波段策略')
    }
  }
}

/**
 * 注册
 * @param name
 * @param password
 * @returns {Promise<*>}
 */
exports.register = async function (data) {
  const user = await UserProxy.findOne({ name: data.name })
  if (user) {
    throw new Error('用户名已存在')
  }
  return UserProxy.newAndSave(data)
}

exports.resetPassword = async function (data) {
  const user = await UserProxy.findOne({ name: data.name })
  if (!user) {
    throw new Error('不存在该用户')
  }
  return UserProxy.update({
    _id: user._id
  }, {
    password: data.password
  })
}
