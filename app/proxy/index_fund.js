const models = require('../models')

const IndexFundModel = models.IndexFund

/**
 * 基本
 */

exports.IndexFundModel = IndexFundModel

exports.newAndSave = function (data) {
  const IndexFund = new IndexFundModel(data)
  return IndexFund.save()
}

exports.delete = function (query) {
  return IndexFundModel.remove(query)
}

exports.update = function (query, data) {
  return IndexFundModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return IndexFundModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return IndexFundModel.findOne(query)
}

exports.findOneById = function (id) {
  return IndexFundModel.findById(id)
}

exports.check = function (query, opt) {
  return IndexFundModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return IndexFundModel.count(query)
}
