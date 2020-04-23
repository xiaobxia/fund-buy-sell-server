module.exports = {
  db: 'mongodb://fbsServer:fbsServer@localhost:27017/fbsServer',
  // 邮件配置
  email: {
    senderAccount: {
      host: 'smtp.mxhichina.com',
      secureConnection: true, // use SSL
      // port: 465, // port for secure SMTP
      port: 465,
      // secure: true, // use TLS
      auth: {
        user: '',
        pass: ''
      },
      ignoreTLS: true
    },
    adminAccount: {
      user: ''
    },
    formName: '养基定投波段'
  }
}
