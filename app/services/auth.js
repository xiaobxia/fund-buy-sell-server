const moment = require('moment')
const md5 = require('md5')
const Proxy = require('../proxy')
const sendMail = require('../common/email')
const emailUtil = require('../util/emailUntil')

const UserProxy = Proxy.User
const EmailActiveProxy = Proxy.EmailActive

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
  const emailActive = await EmailActiveProxy.findOne({ email })
  if (emailActive && emailActive.active === true) {
    throw new Error('邮箱已被注册！')
  } else {
    // 到天
    const code = md5(`${email},${moment().format('YYYY-MM-DD')}`)
    await sendMail(emailUtil.sendEmailActive({
      userEmail: email,
      code
    }))
    if (emailActive) {
      // 之前发送过那就更新
      return EmailActiveProxy.update({ email }, {
        code,
        active: false
      })
    } else {
      // 之前没有发送过那就添加记录
      return EmailActiveProxy.newAndSave({
        email,
        code,
        active: false
      })
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
  const emailActive = await EmailActiveProxy.findOne({ email })
  if (emailActive) {
    if (emailActive.active === true) {
      // 有记录但是已激活
      throw new Error('邮箱已被注册！')
    } else {
      if (emailActive.code === code) {
        // 激活邮箱，添加用户
        return Promise.all([
          EmailActiveProxy.update({ email }, {
            active: true
          }),
          UserProxy.newAndSave({ email, password })
        ])
      } else {
        // 秘钥不匹配
        throw new Error('发生错误，请重新发送注册链接！')
      }
    }
  } else {
    // 没记录
    throw new Error('发生错误，请重新发送注册链接！')
  }
}
