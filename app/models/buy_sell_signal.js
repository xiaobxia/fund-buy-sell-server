const mongoose = require('mongoose')

const Schema = mongoose.Schema
// 买卖信号记录
const schema = new Schema({
  // 交易日
  trade_date: String,
  // 定投记录
  fix_record: {
    type: Array,
    default: []
  },
  // 波段记录
  band_record: {
    type: Array,
    default: []
  },
  // 创建时间
  create_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('BuySellSignal', schema)
