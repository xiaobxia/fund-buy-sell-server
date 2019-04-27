const reqlib = require('app-root-path').require
const pug = require('pug')
const localConfig = reqlib('/config')
const emailConfig = localConfig.email

const sender = emailConfig.senderAccount.auth.user
const formName = emailConfig.formName
const adminEmail = emailConfig.adminAccount.user

function renderEmail (file, data) {
  return pug.renderFile(`../emailTemplate/${file}.pug`, data || {})
}

const sayHello = (option) => {
  return {
    // 格式 name<mail>,发件人的名字<邮箱>
    from: `"${formName}" <${sender}>`,
    // 发送的
    to: option.userEmail || adminEmail,
    // 标题
    subject: 'hello world',
    // html
    html: renderEmail('sayHello')
  }
}

module.exports = {
  sayHello
}
