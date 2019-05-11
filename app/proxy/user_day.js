const models = require('../models')

const UserDayModel = models.UserDay

/**
 * 基本
 */

exports.UserDayModel = UserDayModel

exports.newAndSave = function (data) {
  const UserDay = new UserDayModel(data)
  return UserDay.save()
}

exports.delete = function (query) {
  return UserDayModel.remove(query)
}

exports.update = function (query, data) {
  return UserDayModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return UserDayModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return UserDayModel.findOne(query)
}

exports.findOneById = function (id) {
  return UserDayModel.findById(id)
}

exports.check = function (query, opt) {
  return UserDayModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return UserDayModel.count(query)
}
