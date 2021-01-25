const Proxy = require('../proxy')

const ArticleGzhProxy = Proxy.ArticleGzh

/**
 * 更新文章信息
 * @param data
 * @returns {Promise<*>}
 */
exports.updateArticleGzh = async function (data) {
  if (data.id) {
    const record = await ArticleGzhProxy.findOne({
      _id: data.id
    })
    if (record) {
      // 更新
      return ArticleGzhProxy.update({
        _id: data.id
      }, data)
    } else {
      // 新增
      return ArticleGzhProxy.newAndSave({
        ...data
      })
    }
  } else {
    // 新增
    return ArticleGzhProxy.newAndSave({
      ...data
    })
  }
}

/**
 * 删除
 * @param data
 * @returns {Promise<*>}
 */
exports.deleteRecord = async function (data) {
  return ArticleGzhProxy.delete({
    _id: data.id
  })
}

/**
 * 获取管理员文章列表
 * @param query
 * @param paging
 * @returns {Promise<{count: any, list: any}>}
 */
exports.getAdminArticle = async function (query, paging) {
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
    queryOption.title = new RegExp(query.search, 'i')
  }
  const fetchData = await Promise.all([
    ArticleGzhProxy.find(queryOption, opt),
    ArticleGzhProxy.count(queryOption)
  ])
  const list = fetchData[0]
  return { list: list, count: fetchData[1] }
}

/**
 * 获取用户文章列表
 * @param query
 * @param paging
 * @returns {Promise<{count: any, list: any}>}
 */
exports.getUserArticle = async function (query, paging) {
  const opt = {
    skip: paging.start,
    limit: paging.offset,
    sort: {
      create_at: -1
    }
  }
  let queryOption = {
  }
  const fetchData = await Promise.all([
    ArticleGzhProxy.find(queryOption, opt),
    ArticleGzhProxy.count(queryOption)
  ])
  const list = fetchData[0]
  return { list: list, count: fetchData[1] }
}
