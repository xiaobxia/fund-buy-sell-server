const moment = require('moment')
const md5 = require('md5')
const Proxy = require('../proxy')
const sendMail = require('../common/email')
const constant = require('../const/constant')
const emailUtil = require('../util/emailUntil')

const UserProxy = Proxy.User
const EmailSendLogProxy = Proxy.EmailSendLog
const InvitationLogProxy = Proxy.InvitationLog

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
exports.registerWidthEmail = async function (data) {
  const email = data.email
  const password = data.password
  const inviterEmail = data.inviter_email
  const user = await UserProxy.findOne({ email })
  if (user && user.email_active === true) {
    // 已激活
    throw new Error('邮箱已被注册！')
  } else {
    // 到小时
    const code = md5(`${email}-r,${moment().format('YYYY-MM-DD-HH')}`)
    if (user && user.email_code === code) {
      // 秘钥相同
      throw new Error('邮箱验证已发送请查收，或一小时后重试！')
    } else {
      // 发送一份新的邮件
      await sendMail(emailUtil.sendEmailActive({
        userEmail: email,
        code
      }))
      // 添加发送日志
      EmailSendLogProxy.newAndSave({
        // 邮箱
        email: email,
        // 激活编码
        code: code,
        // 业务类型名称
        type_name: '注册邮件'
      })
      const userOtherInfo = {}
      // 有邀请人
      if (inviterEmail) {
        // 填充邀请人
        userOtherInfo.inviter_email = inviterEmail
        // 添加邀请记录
        InvitationLogProxy.newAndSave({
          // 邀请人
          inviter_email: inviterEmail,
          // 被邀请人
          register_email: email,
          type_name: '注册'
        })
      }
      if (user) {
        // 之前发送过那就更新
        return UserProxy.update({ email }, {
          ...userOtherInfo,
          email_code: code,
          email_active: false,
          password
        })
      } else {
        // 之前没有发送过那就添加记录
        return UserProxy.newAndSave({
          ...userOtherInfo,
          email,
          email_code: code,
          email_active: false,
          password
        })
      }
    }
  }
}

/**
 * 发送激活邮件
 * @param email
 * @returns {Promise<void>}
 */
exports.sendActiveEmail = async function (data) {
  const email = data.email
  const user = await UserProxy.findOne({ email })
  if (user && user.email_active === true) {
    // 已激活
    throw new Error('邮箱已激活！')
  } else {
    // 到小时
    const code = md5(`${email}-r,${moment().format('YYYY-MM-DD-HH')}`)
    if (user && user.email_code === code) {
      // 秘钥相同
      throw new Error('邮箱验证已发送请查收，或一小时后重试！')
    } else {
      // 发送一份新的邮件
      await sendMail(emailUtil.sendEmailActive({
        userEmail: email,
        code
      }))
      // 添加发送日志
      EmailSendLogProxy.newAndSave({
        // 邮箱
        email: email,
        // 激活编码
        code: code,
        // 业务类型名称
        type_name: '注册邮件'
      })
      if (user) {
        // 之前发送过那就更新
        return UserProxy.update({ email }, {
          email_code: code
        })
      } else {
        throw new Error('该邮箱未注册！')
      }
    }
  }
}

/**
 * 邮箱激活
 * @param data
 * @returns {Promise<[(*|undefined), any, any, any, any, any, any, any, any, any]>}
 */
exports.activeRegister = async function (data, services) {
  const activeToken = data.activeToken
  const user = await UserProxy.findOne({ email_code: activeToken })
  if (user) {
    if (user.email_active === true) {
      // 有记录但是已激活
      throw new Error('邮箱已激活！')
    } else {
      if (user.email_code === activeToken) {
        // 有邀请人
        if (user.inviter_email) {
          // 添加邀请记录
          InvitationLogProxy.newAndSave({
            // 邀请人
            inviter_email: user.inviter_email,
            // 被邀请人
            register_email: user.email,
            type_name: '激活'
          })
          // 分发奖励
          services.user.addUserVipDays({
            email: user.inviter_email,
            days: constant.INVITER_REWARD_DAYS
          })
        }
        // 激活用户
        return UserProxy.update({ email: user.email }, {
          email_active: true,
          email_code: ''
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

/**
 * 发送忘记密码邮件
 * @param email
 * @returns {Promise<*>}
 */
exports.sendForgetEmail = async function (data) {
  const email = data.email
  const user = await UserProxy.findOne({ email })
  if (user) {
    // 到小时
    const code = md5(`${email}-f,${moment().format('YYYY-MM-DD-HH')}`)
    if (user.email_code === code) {
      // 秘钥相同
      throw new Error('邮箱验证已发送请查收，或一小时后重试！')
    } else {
      // 发送一份新的邮件
      await sendMail(emailUtil.sendEmailForget({
        userEmail: email,
        code
      }))
      EmailSendLogProxy.newAndSave({
        // 邮箱
        email: email,
        // 激活编码
        code: code,
        // 业务类型名称
        type_name: '忘记密码邮件'
      })
      // 更新
      return UserProxy.update({ email }, {
        email_code: code
      })
    }
  } else {
    throw new Error('该邮箱未注册！')
  }
}

/**
 * 重置密码邮件
 * @param data
 * @returns {Promise<*>}
 */
exports.resetPassword = async function (data, services) {
  const code = data.code
  const password = data.password
  const user = await UserProxy.findOne({ email_code: code })
  if (user) {
    if (user.email_code === code) {
      // 有邀请人
      if (user.inviter_email) {
        // 添加邀请记录
        InvitationLogProxy.newAndSave({
          // 邀请人
          inviter_email: user.inviter_email,
          // 被邀请人
          register_email: user.email,
          type_name: '激活'
        })
        // 分发奖励
        services.user.addUserVipDays({
          email: user.inviter_email,
          days: constant.INVITER_REWARD_DAYS
        })
      }
      // 更新密码
      return UserProxy.update({ email_code: code }, {
        password,
        email_active: true,
        email_code: ''
      })
    } else {
      // 秘钥不匹配
      throw new Error('发生错误，请重新发起找回密码！')
    }
  } else {
    // 没记录
    throw new Error('该邮箱未注册！')
  }
}
