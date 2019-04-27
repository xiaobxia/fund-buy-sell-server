const mongoose = require('mongoose')

const Schema = mongoose.Schema
// 字典
const schema = new Schema({
  // 键
  key: String,
  // 说明
  describe: String,
  // 归类
  type: String,
  // 值
  value: String,
  create_at: {
    type: Date,
    default: Date.now
  }
})

schema.index({ key: 1 }, { unique: true })

module.exports = mongoose.model('Dictionary', schema)
