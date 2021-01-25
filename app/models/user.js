const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema({
  // 邮箱是唯一的
  email: String,
  // 邮箱是否激活
  email_active: {
    type: Boolean,
    default: false
  },
  email_code: String,
  // 密码
  password: String,
  // 当前token
  token: String,
  // -------其他
  name: String,
  mobile: String,
  true_name: String,
  // 性别
  gender: Number,
  birthday: Date,
  city: String,
  website: String,
  company: String,
  school: String,
  job: String,
  introduce: String,
  // 角色 []
  roles: Array,
  last_login_date: Date,
  // 业务数据
  // 邀请人
  inviter_email: String,
  // vip剩余天数
  vip_days: {
    type: Number,
    default: 0
  },
  create_at: {
    type: Date,
    default: Date.now
  }
})
// 1升序，-1降序。比如积分一般在排序时越大的在越前面，所以用降序
schema.index({ email: 1 }, { unique: true })

module.exports = mongoose.model('User', schema)
