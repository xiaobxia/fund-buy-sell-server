module.exports = {
  // 项目的地址
  projectUrl: 'http://funduse.xiaobxia.com/',
  db: 'mongodb://fbsServer:fbsServer@localhost:27017/fbsServer',
  // 邮件配置
  email: {
    // 用于发送邮件
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
    // 管理员邮箱，用于接收邮件
    adminAccount: {
      user: '673806687@qq.com'
    },
    formName: '养基定投波段'
  }
}
