/**
 * 更新文章信息
 * @param ctx
 * @returns {Promise<void>}
 */
exports.updateArticleGzh = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      title: { type: 'string', required: true },
      introduction: { type: 'string', required: true },
      url: { type: 'string', required: true },
      pic_url: { type: 'string', required: false },
      id: { type: 'string', required: false }
    }, query)
    await ctx.services.articleGzh.updateArticleGzh(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 删除
 * @param ctx
 * @returns {Promise<void>}
 */
exports.deleteRecord = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      id: { type: 'string', required: true }
    }, query)
    await ctx.services.articleGzh.deleteRecord(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 获取管理员文章列表
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getAdminArticle = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      current: { type: 'int', required: true },
      pageSize: { type: 'int', required: true },
      beginTime: { required: false, type: 'string' },
      endTime: { required: false, type: 'string' },
      search: { required: false, type: 'string' }
    }, query)
    let paging = ctx.paging(data.current, data.pageSize)
    const records = await ctx.services.articleGzh.getAdminArticle(data, paging)
    ctx.body = ctx.resuccess(records)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 获取用户文章列表
 * @param ctx
 * @returns {Promise<void>}
 */
exports.getUserArticle = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      current: { type: 'int', required: true },
      pageSize: { type: 'int', required: true }
    }, query)
    let paging = ctx.paging(data.current, data.pageSize)
    const records = await ctx.services.articleGzh.getUserArticle(data, paging)
    ctx.body = ctx.resuccess(records)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}