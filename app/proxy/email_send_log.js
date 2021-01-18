const models = require('../models')

const EmailSendLogModel = models.EmailSendLog

/**
 * 基本
 */
exports.EmailSendLogModel = EmailSendLogModel

exports.newAndSave = function (data) {
  const EmailSendLog = new EmailSendLogModel(data)
  return EmailSendLog.save()
}

exports.delete = function (query) {
  return EmailSendLogModel.remove(query)
}

exports.update = function (query, data) {
  return EmailSendLogModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return EmailSendLogModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return EmailSendLogModel.findOne(query)
}

exports.findOneById = function (id) {
  return EmailSendLogModel.findById(id)
}

exports.check = function (query, opt) {
  return EmailSendLogModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return EmailSendLogModel.count(query)
}
