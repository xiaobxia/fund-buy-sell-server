const models = require('../models')

const EmailActiveModel = models.EmailActive

/**
 * 基本
 */
exports.EmailActiveModel = EmailActiveModel

exports.newAndSave = function (data) {
  const EmailActive = new EmailActiveModel(data)
  return EmailActive.save()
}

exports.delete = function (query) {
  return EmailActiveModel.remove(query)
}

exports.update = function (query, data) {
  return EmailActiveModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return EmailActiveModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return EmailActiveModel.findOne(query)
}

exports.findOneById = function (id) {
  return EmailActiveModel.findById(id)
}

exports.check = function (query, opt) {
  return EmailActiveModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return EmailActiveModel.count(query)
}
