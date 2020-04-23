const moment = require('moment')
const md5 = require('md5')
const Proxy = require('../proxy')

const UserProxy = Proxy.User
const EmailActiveProxy = Proxy.EmailActive

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

exports.sendRegisterEmail = async function (email) {
  const emailActive = await EmailActiveProxy.findOne({ email })
  if (emailActive && emailActive.active === true) {
    throw new Error('邮箱已被注册！')
  } else {
    // 到天
    const code = md5(`${email},${moment().format('YYYY-MM-DD')}`)
    if (emailActive) {
      // 之前发送过那就更新
      EmailActiveProxy.update({ email }, {
        code
      })
    } else {
      // 之前没有发送过那就添加记录
      EmailActiveProxy.newAndSave({
        email,
        code
      })
    }
  }
}
