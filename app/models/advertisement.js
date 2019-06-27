const mongoose = require('mongoose')

const Schema = mongoose.Schema
const schema = new Schema({
  // 广告归类
  type: String,
  // 图片的地址
  img_url: String,
  // 状态，上线下线
  status: Number,
  create_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Advertisement', schema)
