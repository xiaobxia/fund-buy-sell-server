const mongoose = require('mongoose')

const Schema = mongoose.Schema
// 意见反馈
const schema = new Schema({
  // 邮箱
  email: String,
  // 内容
  content: String,
  create_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Feedback', schema)
