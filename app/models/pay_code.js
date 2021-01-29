const mongoose = require('mongoose')

const Schema = mongoose.Schema
// 支付码
const schema = new Schema({
  // 邮箱
  email: String,
  // 支付编码
  code: String,
  // 创建时间
  create_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('PayCode', schema)
