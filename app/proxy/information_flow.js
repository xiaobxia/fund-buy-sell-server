const models = require('../models')

const InformationFlowModel = models.InformationFlow

/**
 * 基本
 */
exports.InformationFlowModel = InformationFlowModel

exports.newAndSave = function (data) {
  const InformationFlow = new InformationFlowModel(data)
  return InformationFlow.save()
}

exports.delete = function (query) {
  return InformationFlowModel.remove(query)
}

exports.update = function (query, data) {
  return InformationFlowModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return InformationFlowModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return InformationFlowModel.findOne(query)
}

exports.findOneById = function (id) {
  return InformationFlowModel.findById(id)
}

exports.check = function (query, opt) {
  return InformationFlowModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return InformationFlowModel.count(query)
}
