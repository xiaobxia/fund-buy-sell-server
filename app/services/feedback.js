const Proxy = require('../proxy')

const FeedbackProxy = Proxy.Feedback

/**
 * 添加记录
 * @param data
 * @returns {Promise<*>}
 */
exports.addFeedback = async function (data) {
  return FeedbackProxy.newAndSave({
    email: data.email,
    content: data.content
  })
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
