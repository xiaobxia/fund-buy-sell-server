const path = require('path')
const env = process.env.NODE_ENV
const isDev = env !== 'prod'

const root = path.resolve(__dirname, '../')
function resolveRoot (dir) {
  return path.resolve(root, dir)
}
let dbAddress = 'mongodb://127.0.0.1:27017/fbsServer'
let fundDataAddress = 'http://47.92.210.171:3006'
let stockDataAddress = 'http://47.98.140.76:3016'

// 测试
if (isDev) {
  dbAddress = 'mongodb://47.92.210.171:27017/fbsServer'
  fundDataAddress = 'http://127.0.0.1:3016'
  stockDataAddress = 'http://47.98.140.76:3016'
  // stockDataAddress = 'http://127.0.0.1:3016'
}

module.exports = {
  root: path.resolve(__dirname, '../'),
  project: {
    projectName: 'fbsServer'
  },
  server: {
    port: 3051,
    token: {
      key: 'fbsServer',
      expiresIn: 60 * 60 * 24
    }
  },
  // 日志配置
  logger: {
    dir: resolveRoot('logs'),
    fileName: 'cheese.log',
    debugLogLevel: 'all',
    productLogLevel: 'info'
  },
  // 上传配置
  uploadDir: 'uploads',
  // 阿里云2，用于测试
  db: dbAddress,
  fundDataAddress: fundDataAddress,
  stockDataAddress: stockDataAddress,
  fundServerAddress: 'http://47.98.140.76:3020/fundServer',
  qiniu: {
    zone: 'Zone_z2'
  },
  // 邮件配置
  email: {
    senderAccount: {
      host: 'smtp.mxhichina.com',
      secureConnection: !isDev, // use SSL
      // port: 465, // port for secure SMTP
      port: isDev ? 25 : 465,
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
    formName: 'Xiaobxia'
  }
}
