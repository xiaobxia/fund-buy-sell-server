const mongoose = require('mongoose')

const Schema = mongoose.Schema
// 风控信号记录
const schema = new Schema({
  // 交易日
  trade_date: String,
  // 记录
  record: {
    type: Array,
    default: []
  },
  // 创建时间
  create_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('RiskSignal', schema)
