const mongoose = require('mongoose')

const Schema = mongoose.Schema
// 邀请记录
const schema = new Schema({
  // 邀请人
  inviter_email: String,
  // 被邀请人
  register_email: String,
  // 类型
  type_name: String,
  // 创建时间
  create_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('InvitationLog', schema)
