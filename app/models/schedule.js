const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema({
  // 名称
  name: String,
  // 说明
  describe: String,
  // 归类
  type: String,
  // 是否开启
  open: String,
  // 创建时间
  create_at: {
    type: Date,
    default: Date.now
  }
})

schema.index({ name: 1 }, { unique: true })

module.exports = mongoose.model('Schedule', schema)
