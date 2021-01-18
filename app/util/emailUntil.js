const reqlib = require('app-root-path').require
const localConfig = reqlib('/config')
const emailConfig = localConfig.email

const sender = emailConfig.senderAccount.auth.user
const formName = emailConfig.formName
const adminEmail = emailConfig.adminAccount.user

const projectUrl = localConfig.projectUrl
const mobileUrl = localConfig.mobileUrl

const sayHello = (option) => {
  return {
    // 格式 name<mail>,发件人的名字<邮箱>
    from: `"${formName}" <${sender}>`,
    // 发送的
    to: option.userEmail || adminEmail,
    // 标题
    subject: 'hello world',
    // html
    html: 'hello world'
  }
}

const sendEmailActive = (option) => {
  const activeUrl = `${mobileUrl}/activeRegister?activeToken=${option.code}`
  let html = `<p>您申请将${option.userEmail}设置为登录邮箱，要完成该操作。</p>`
  html += `<p>请点击该链接注册激活，如果验证链接无法点击，请将链接复制粘贴到浏览器地址栏:</p>`
  html += `<p><a href="${activeUrl}">${activeUrl}</a></p>`
  return {
    // 格式 name<mail>,发件人的名字<邮箱>
    from: `"${formName}" <${sender}>`,
    // 发送的
    to: option.userEmail,
    // 标题
    subject: '注册激活',
    // html
    html: html
  }
}

const sendEmailForget = (option) => {
  const activeUrl = `${projectUrl}?activeToken=${option.code}`
  let html = `<p>您将为${option.userEmail}找回密码，要完成该操作。</p>`
  html += `<p>请点击该链接找回密码，如果验证链接无法点击，请将链接复制粘贴到浏览器地址栏:</p>`
  html += `<p><a href="${activeUrl}">${activeUrl}</a></p>`
  return {
    // 格式 name<mail>,发件人的名字<邮箱>
    from: `"${formName}" <${sender}>`,
    // 发送的
    to: option.userEmail,
    // 标题
    subject: '忘记密码',
    // html
    html: html
  }
}

module.exports = {
  sayHello,
  sendEmailActive,
  sendEmailForget
}
