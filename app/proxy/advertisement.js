const models = require('../models')

const AdvertisementModel = models.Advertisement

/**
 * 基本
 */

exports.AdvertisementModel = AdvertisementModel

exports.newAndSave = function (data) {
  const Advertisement = new AdvertisementModel(data)
  return Advertisement.save()
}

exports.delete = function (query) {
  return AdvertisementModel.remove(query)
}

exports.update = function (query, data) {
  return AdvertisementModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return AdvertisementModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return AdvertisementModel.findOne(query)
}

exports.findOneById = function (id) {
  return AdvertisementModel.findById(id)
}

exports.check = function (query, opt) {
  return AdvertisementModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return AdvertisementModel.count(query)
}
