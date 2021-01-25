const models = require('../models')

const ArticleGzhModel = models.ArticleGzh

/**
 * 基本
 */
exports.ArticleGzhModel = ArticleGzhModel

exports.newAndSave = function (data) {
  const ArticleGzh = new ArticleGzhModel(data)
  return ArticleGzh.save()
}

exports.delete = function (query) {
  return ArticleGzhModel.remove(query)
}

exports.update = function (query, data) {
  return ArticleGzhModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return ArticleGzhModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return ArticleGzhModel.findOne(query)
}

exports.findOneById = function (id) {
  return ArticleGzhModel.findById(id)
}

exports.check = function (query, opt) {
  return ArticleGzhModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return ArticleGzhModel.count(query)
}
