const mongoose = require('mongoose')

const Schema = mongoose.Schema
// 邮箱激活
const schema = new Schema({
  // 邮箱
  email: String,
  // 激活编码
  code: String,
  // 是否激活
  active: {
    type: Boolean,
    default: false
  },
  // 创建时间
  create_at: {
    type: Date,
    default: Date.now
  }
})

schema.index({ key: 1 }, { unique: true })

module.exports = mongoose.model('EmailActive', schema)
