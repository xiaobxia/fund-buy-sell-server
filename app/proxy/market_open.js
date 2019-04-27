const models = require('../models')

const MarketOpenModel = models.MarketOpen

/**
 * 基本
 */

exports.MarketOpenModel = MarketOpenModel

exports.newAndSave = function (data) {
  const MarketOpen = new MarketOpenModel(data)
  return MarketOpen.save()
}

exports.delete = function (query) {
  return MarketOpenModel.remove(query)
}

exports.update = function (query, data) {
  return MarketOpenModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return MarketOpenModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return MarketOpenModel.findOne(query)
}

exports.findOneById = function (id) {
  return MarketOpenModel.findById(id)
}

exports.check = function (query, opt) {
  return MarketOpenModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return MarketOpenModel.count(query)
}
