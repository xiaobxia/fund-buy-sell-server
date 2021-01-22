const models = require('../models')

const FeedbackModel = models.Feedback

/**
 * 基本
 */
exports.FeedbackModel = FeedbackModel

exports.newAndSave = function (data) {
  const Feedback = new FeedbackModel(data)
  return Feedback.save()
}

exports.delete = function (query) {
  return FeedbackModel.remove(query)
}

exports.update = function (query, data) {
  return FeedbackModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return FeedbackModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return FeedbackModel.findOne(query)
}

exports.findOneById = function (id) {
  return FeedbackModel.findById(id)
}

exports.check = function (query, opt) {
  return FeedbackModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return FeedbackModel.count(query)
}
