const models = require('../models')

const InvitationLogModel = models.InvitationLog

/**
 * 基本
 */
exports.InvitationLogModel = InvitationLogModel

exports.newAndSave = function (data) {
  const InvitationLog = new InvitationLogModel(data)
  return InvitationLog.save()
}

exports.delete = function (query) {
  return InvitationLogModel.remove(query)
}

exports.update = function (query, data) {
  return InvitationLogModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return InvitationLogModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return InvitationLogModel.findOne(query)
}

exports.findOneById = function (id) {
  return InvitationLogModel.findById(id)
}

exports.check = function (query, opt) {
  return InvitationLogModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return InvitationLogModel.count(query)
}
