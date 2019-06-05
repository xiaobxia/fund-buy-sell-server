const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema({
  code: String,
  name: String,
  type: Number,
  fundCode: String,
  fundName: String,
  // 月收益
  month_rate: Number,
  // []
  detail: Object,
  // 排序索引，越大越靠前
  sortIndex: {
    type: Number,
    default: 100
  },
  create_at: {
    type: Date,
    default: Date.now
  }
})

// 指数基金
schema.index({ code: 1, type: 1 }, { unique: true })
schema.index({ create_at: -1 })

module.exports = mongoose.model('IndexFund', schema)
