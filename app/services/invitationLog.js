const Proxy = require('../proxy')

const InvitationLogProxy = Proxy.InvitationLog

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
  const fetchData = await Promise.all([
    InvitationLogProxy.find(queryOption, opt),
    InvitationLogProxy.count(queryOption)
  ])
  const list = fetchData[0]
  return { list: list, count: fetchData[1] }
}
