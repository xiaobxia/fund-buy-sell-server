const mongoose = require('mongoose')

const Schema = mongoose.Schema
// 邮箱激活邮件记录
const schema = new Schema({
  // 邮箱
  email: String,
  // 激活编码
  code: String,
  // 业务类型名称
  type_name: String,
  // 创建时间
  create_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('EmailSendLog', schema)
