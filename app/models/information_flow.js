const mongoose = require('mongoose')

const Schema = mongoose.Schema
// 暂时是管理员才能发
// 信息流
const schema = new Schema({
  // 内容
  content: String,
  // 是否是会员专属内容
  is_vip: {
    type: Boolean,
    default: false
  },
  user_like: {
    type: Array,
    default: []
  },
  // user: { type: Schema.Types.ObjectId, ref: 'User' },
  // 创建时间
  create_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('InformationFlow', schema)
