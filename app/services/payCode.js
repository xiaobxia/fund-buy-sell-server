const Proxy = require('../proxy')

const PayCodeProxy = Proxy.PayCode

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
    PayCodeProxy.find(queryOption, opt),
    PayCodeProxy.count(queryOption)
  ])
  const list = fetchData[0]
  return { list: list, count: fetchData[1] }
}

/**
 * 生成支付码
 * @param query
 * @param services
 * @returns {Promise<*>}
 */
exports.createPayCode = async function (query, services) {
  const email = query.email
  // 6位验证码
  const code = Math.random().toFixed(6).toString().split('.')[1]
  await PayCodeProxy.newAndSave({
    email: email,
    code: code
  })
  return code
}
