const mongoose = require('mongoose')
const reqlib = require('app-root-path').require
const config = reqlib('/config/index')

mongoose.Promise = Promise
mongoose.connect(config.db, {
  server: {
    poolSize: 20
  }
}, (err) => {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message)
    process.exit(1)
  }
})

/**
 * ObjectID ：文档的id
 * String： 字符串，最常用，必须是utf-8
 * Boolean：布尔值，true 或者false
 * Number：数字
 * Array：数组或者列表，多个值存储到一个键
 * Mixed：混合
 * Date：存储当前日期或时间unix时间格式
 * Buffer：缓冲区
 */

// 每条记录都会有_id,这是默认的索引

// 模型
exports.User = require('./user')
exports.LogAudit = require('./logAudit')
exports.Dictionary = require('./dictionary')
exports.Schedule = require('./schedule')
exports.EmailActive = require('./email_active')
