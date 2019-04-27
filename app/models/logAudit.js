const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const schema = new Schema({
  log_type: String,
  user_id: { type: ObjectId },
  user_name: String,
  platform: String,
  create_at: {
    type: Date,
    default: Date.now
  }
})
// 一般是以用户id查
schema.index({ user_name: 1, create_at: -1 })

module.exports = mongoose.model('LogAudit', schema)
