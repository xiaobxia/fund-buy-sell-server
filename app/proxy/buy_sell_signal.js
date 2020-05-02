const models = require('../models')

const BuySellSignalModel = models.BuySellSignal

/**
 * 基本
 */
exports.BuySellSignalModel = BuySellSignalModel

exports.newAndSave = function (data) {
  const buySellSignal = new BuySellSignalModel(data)
  return buySellSignal.save()
}

exports.delete = function (query) {
  return BuySellSignalModel.remove(query)
}

exports.update = function (query, data) {
  return BuySellSignalModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return BuySellSignalModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return BuySellSignalModel.findOne(query)
}

exports.findOneById = function (id) {
  return BuySellSignalModel.findById(id)
}

exports.check = function (query, opt) {
  return BuySellSignalModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return BuySellSignalModel.count(query)
}
