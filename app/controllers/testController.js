const reqlib = require('app-root-path').require
const config = reqlib('/config/index')
const sendMail = require('../common/email')
const emailUtil = require('../util/emailUntil')

/**
 * 发送测试邮件
 * @param ctx
 * @returns {Promise<void>}
 */
exports.testEmail = async function (ctx) {
  try {
    await sendMail(emailUtil.sayHello({
      userEmail: config.email.adminAccount.user
    }))
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 测试数据返回
 * @param ctx
 * @returns {Promise<void>}
 */
exports.testResponse = async function (ctx) {
  try {
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
