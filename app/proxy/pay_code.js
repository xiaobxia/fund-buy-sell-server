const models = require('../models')

const PayCodeModel = models.PayCode

/**
 * 基本
 */
exports.PayCodeModel = PayCodeModel

exports.newAndSave = function (data) {
  const buySellSignal = new PayCodeModel(data)
  return buySellSignal.save()
}

exports.delete = function (query) {
  return PayCodeModel.remove(query)
}

exports.update = function (query, data) {
  return PayCodeModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return PayCodeModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return PayCodeModel.findOne(query)
}

exports.findOneById = function (id) {
  return PayCodeModel.findById(id)
}

exports.check = function (query, opt) {
  return PayCodeModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return PayCodeModel.count(query)
}
