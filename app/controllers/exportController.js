/**
 * 导出数字
 * @param ctx
 * @returns {Promise<void>}
 */
exports.exportNumbers = async function (ctx) {
  try {
    let list = []
    for (let i = 0; i < 10; i++) {
      list.push({
        number: i
      })
    }
    ctx.body = {
      list
    }
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
