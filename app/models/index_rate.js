const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema({
  // 记录
  record: {
    type: Array,
    default: []
  },
  // 日期
  trade_date: String,
  create_at: {
    type: Date,
    default: Date.now
  }
})

// 日期唯一
schema.index({ trade_date: -1 }, { unique: true })

module.exports = mongoose.model('IndexRate', schema)
