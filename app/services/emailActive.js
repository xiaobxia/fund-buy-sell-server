const Proxy = require('../proxy')

const EmailActiveProxy = Proxy.EmailActive

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
  if (query.active) {
    queryOption.active = query.active === '1'
  }
  const fetchData = await Promise.all([
    EmailActiveProxy.find(queryOption, opt),
    EmailActiveProxy.count(queryOption)
  ])
  const list = fetchData[0]
  return { list: list, count: fetchData[1] }
}
