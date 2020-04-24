const moment = require('moment')
const md5 = require('md5')
const Proxy = require('../proxy')
const sendMail = require('../common/email')
const emailUtil = require('../util/emailUntil')

const UserProxy = Proxy.User

/**
 * 登录
 * @param email
 * @param password
 * @returns {Promise<void>}
 */
exports.login = async function (email, password) {
  const user = await UserProxy.findOne({ email: email })
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

/**
 * 发送注册邮件
 * @param email
 * @returns {Promise<void>}
 */
exports.sendRegisterEmail = async function (email) {
  const user = await UserProxy.findOne({ email })
  if (user && user.email_active === true) {
    // 已激活
    throw new Error('邮箱已被注册！')
  } else {
    // 到小时
    const code = md5(`${email},${moment().format('YYYY-MM-DD-HH')}`)
    if (user && user.email_code === code) {
      // 秘钥相同
      throw new Error('邮箱已发送请查收！')
    } else {
      // 发送一份新的邮件
      await sendMail(emailUtil.sendEmailActive({
        userEmail: email,
        code
      }))
      if (user) {
        // 之前发送过那就更新
        return UserProxy.update({ email }, {
          email_code: code,
          email_active: false
        })
      } else {
        // 之前没有发送过那就添加记录
        return UserProxy.newAndSave({
          email,
          email_code: code,
          email_active: false
        })
      }
    }
  }
}

/**
 * 邮箱注册
 * @param data
 * @returns {Promise<[(*|undefined), any, any, any, any, any, any, any, any, any]>}
 */
exports.registerWithEmail = async function (data) {
  const email = data.email
  const code = data.code
  const password = data.password
  const user = await UserProxy.findOne({ email })
  if (user) {
    if (user.email_active === true) {
      // 有记录但是已激活
      throw new Error('邮箱已被注册！')
    } else {
      if (user.email_code === code) {
        // 激活用户
        return UserProxy.update({ email}, {
          email_active: true,
          password
        })
      } else {
        // 秘钥不匹配
        throw new Error('发生错误，请重新发起邮箱验证！')
      }
    }
  } else {
    // 没记录
    throw new Error('发生错误，请重新发起邮箱验证！')
  }
}

exports.sendForgetEmail = async function (email) {
  const user = await UserProxy.findOne({ email })
  if (user && user.email_active === true) {
  } else {
    throw new Error('该邮箱未注册！')
  }
}
