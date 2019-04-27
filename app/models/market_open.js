const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema({
  open: Boolean,
  // 日期
  date: String,
  create_at: {
    type: Date,
    default: Date.now
  }
})

// 日期唯一
schema.index({ date: -1 }, { unique: true })

module.exports = mongoose.model('MarketOpen', schema)
