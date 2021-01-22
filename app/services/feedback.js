const moment = require('moment')
const Proxy = require('../proxy')

const FeedbackProxy = Proxy.Feedback

/**
 * 添加记录
 * @param data
 * @returns {Promise<*>}
 */
exports.addFeedback = async function (data) {
  const opt = {
    sort: '-create_at',
    limit: 1
  }
  const records = await FeedbackProxy.find({}, opt)
  const lastOne = records[0]
  if (lastOne) {
    const lastTime = moment(lastOne.create_at).format('YYYY-MM-DD-HH')
    const now = moment().format('YYYY-MM-DD-HH')
    // 过于频繁
    if (lastTime === now) {
      throw new Error('您的反馈我们已收到，请一小时后重新发起！')
    } else {
      return FeedbackProxy.newAndSave({
        email: data.email,
        content: data.content
      })
    }
  } else {
    // 之前没有反馈过
    return FeedbackProxy.newAndSave({
      email: data.email,
      content: data.content
    })
  }
}

/**
 * 分页获取记录
 * @param query
 * @param paging
 * @returns {Promise<{count: any, list: any}>}
 */
exports.getRecords = async function (query, paging) {
  const opt = {
    skip: paging.start,
    limit: paging.offset,
    sort: {
      create_at: -1
    }
  }
  let queryOption = {
  }
  if (query.beginTime) {
    queryOption.create_at = {
      $gte: query.beginTime,
      $lt: query.endTime
    }
  }
  // 模糊匹配
  if (query.search) {
    queryOption.email = new RegExp(query.search, 'i')
  }
  const fetchData = await Promise.all([
    FeedbackProxy.find(queryOption, opt),
    FeedbackProxy.count(queryOption)
  ])
  const list = fetchData[0]
  return { list: list, count: fetchData[1] }
}
