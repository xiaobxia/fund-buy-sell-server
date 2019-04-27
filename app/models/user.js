const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema({
  // 微信id
  name: String,
  password: String,
  email: String,
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
  token: String,
  // 角色 []
  roles: Array,
  last_login_date: Date,
  // 上一次使用的设备id
  last_device_id: String,
  // 上一次使用该设备的时间
  last_device_time: Date,
  // 购买的类型
  buy_type: String,
  // 剩余可使用日期
  can_use_day: {
    type: Number,
    default: 0
  },
  // 状态(1正常，2拉黑)
  status: {
    type: Number,
    default: 1
  },
  // 奖励
  reward: {
    type: Number,
    default: 0
  },
  if_reward: {
    type: Boolean,
    default: false
  },
  // 是否试用过
  if_test: {
    type: Boolean,
    default: false
  },
  // 是否计算今日
  if_count_day: {
    type: Boolean,
    default: true
  },
  history_login: {
    type: Number,
    default: 0
  },
  history_query: {
    type: Number,
    default: 0
  },
  today_login: {
    type: Number,
    default: 0
  },
  today_query: {
    type: Number,
    default: 0
  },
  create_at: {
    type: Date,
    default: Date.now
  }
})
// 微信id不可重复
schema.index({ name: 1 }, { unique: true })

module.exports = mongoose.model('User', schema)
