const models = require('../models')

const ScheduleModel = models.Schedule

/**
 * 基本
 */

exports.ScheduleModel = ScheduleModel

exports.newAndSave = function (data) {
  const Schedule = new ScheduleModel(data)
  return Schedule.save()
}

exports.delete = function (query) {
  return ScheduleModel.remove(query)
}

exports.update = function (query, data) {
  return ScheduleModel.update(query, {
    $set: data
  })
}

exports.find = function (query, opt) {
  return ScheduleModel.find(query, {}, opt)
}

exports.findOne = function (query) {
  return ScheduleModel.findOne(query)
}

exports.findOneById = function (id) {
  return ScheduleModel.findById(id)
}

exports.check = function (query, opt) {
  return ScheduleModel.findOne(query, '_id', opt)
}

exports.count = function (query) {
  return ScheduleModel.count(query)
}
