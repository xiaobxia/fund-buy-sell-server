/**
 * 更新信息流信息
 * @param ctx
 * @returns {Promise<void>}
 */
exports.updateInfoFlow = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      content: { type: 'string', required: true },
      is_vip: { type: 'boolean', required: true },
      id: { type: 'string', required: false }
    }, query)
    await ctx.services.informationFlow.updateInfoFlow(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
