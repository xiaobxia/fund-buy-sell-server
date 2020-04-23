module.exports = {
  db: 'mongodb://fbsServer:fbsServer@47.92.210.171:27017/fbsServer',
  // 邮件配置
  email: {
    senderAccount: {
      host: 'smtp.163.com',
      secureConnection: false, // use SSL
      // port: 465, // port for secure SMTP
      port: 25,
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
