module.exports = {
  db: 'mongodb://fbsServer:fbsServer@localhost:27017/fbsServer',
  // 邮件配置
  email: {
    senderAccount: {
      host: 'smtp.163.com',
      secureConnection: true, // use SSL
      // port: 465, // port for secure SMTP
      port: 465,
      // secure: true, // use TLS
      auth: {
        user: 'yangjidingtou@163.com',
        pass: 'WOKBLFSPGEIFTEVH'
      },
      ignoreTLS: true
    },
    adminAccount: {
      user: '673806687@qq.com'
    },
    formName: '养基定投波段'
  }
}
