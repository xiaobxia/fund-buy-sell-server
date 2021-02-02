const models = require('../models')

const IndexRateModel = models.IndexRate

/**
 * 基本
 */
exports.IndexRateModel = IndexRateModel

exports.newAndSave = function (data) {
  const IndexRate = new IndexRateModel(data)
  return IndexRate.save()
}

exports.delete = function (query) {
  return IndexRateModel.remove(query)
}

exports.update = function (query, data) {
  return IndexRateModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return IndexRateModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return IndexRateModel.findOne(query)
}

exports.findOneById = function (id) {
  return IndexRateModel.findById(id)
}

exports.check = function (query, opt) {
  return IndexRateModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return IndexRateModel.count(query)
}
