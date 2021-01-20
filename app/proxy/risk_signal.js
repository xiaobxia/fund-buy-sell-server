const models = require('../models')

const RiskSignalModel = models.RiskSignal

/**
 * 基本
 */
exports.RiskSignalModel = RiskSignalModel

exports.newAndSave = function (data) {
  const RiskSignal = new RiskSignalModel(data)
  return RiskSignal.save()
}

exports.delete = function (query) {
  return RiskSignalModel.remove(query)
}

exports.update = function (query, data) {
  return RiskSignalModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return RiskSignalModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return RiskSignalModel.findOne(query)
}

exports.findOneById = function (id) {
  return RiskSignalModel.findById(id)
}

exports.check = function (query, opt) {
  return RiskSignalModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return RiskSignalModel.count(query)
}
