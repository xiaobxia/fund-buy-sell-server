const mongoose = require('mongoose')

const Schema = mongoose.Schema

// 公众号内容
const schema = new Schema({
  // 标题
  title: String,
  // 简介
  introduction: String,
  // 缩略图
  pic_url: String,
  // 文章地址
  url: String,
  // 创建时间
  create_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('ArticleGzh', schema)
