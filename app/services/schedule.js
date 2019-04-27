const Proxy = require('../proxy')

const ScheduleProxy = Proxy.Schedule

/**
 * 添加定时任务
 * @param data
 * @returns {Promise<*>}
 */
exports.addSchedule = async function (data) {
  const schedule = await ScheduleProxy.check({ name: data.name })
  if (schedule) {
    throw new Error('定时任务已存在')
  }
  return ScheduleProxy.newAndSave({
    ...data
  })
}

/**
 * 删除定时任务
 * @param name
 * @returns {Promise<*>}
 */
exports.deleteSchedule = async function (name) {
  const schedule = await ScheduleProxy.check({ name })
  if (!schedule) {
    throw new Error('定时任务不存在')
  }
  return ScheduleProxy.delete({ name })
}

/**
 * 更新定时任务
 * @param name
 * @param data
 * @returns {Promise<*>}
 */
exports.updateSchedule = async function (name, data) {
  const schedule = await ScheduleProxy.check({ name })
  if (!schedule) {
    throw new Error('定时任务不存在')
  }
  return ScheduleProxy.update({ name }, data)
}

/**
 * 获取单个定时任务
 * @param name
 * @returns {Promise<*>}
 */
exports.getSchedule = async function (name) {
  return ScheduleProxy.findOne({ name })
}

/**
 * 获取所有定时任务
 * @returns {Promise<*>}
 */
exports.getSchedules = async function () {
  return ScheduleProxy.find({})
}

/**
 * 分页获取定时任务
 * @param query
 * @param paging
 * @returns {Promise<{list: any, count: any}>}
 */
exports.getSchedulesByPaging = async function (query, paging) {
  const opt = {
    skip: paging.start,
    limit: paging.offset,
    sort: '-create_at'
  }
  const queryOption = {}
  const data = await Promise.all([
    ScheduleProxy.find(queryOption, opt),
    ScheduleProxy.count(queryOption)
  ])
  return { list: data[0], count: data[1] }
}
