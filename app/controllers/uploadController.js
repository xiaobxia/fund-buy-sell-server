const fs = require('fs-extra')
const del = require('del')

/**
 * 获取文件地址
 * @param ctx
 * @returns {string}
 */
function getFilePath (ctx) {
  return `${ctx.localConfig.uploadDir}/${ctx.req.file.filename}`
}

/**
 * 导入数字
 * @param ctx
 * @returns {Promise<void>}
 */
exports.importNumbers = async function (ctx) {
  // 获取上传数据
  const filePath = getFilePath(ctx)
  const data = await fs.readJson(filePath)
  try {
    ctx.body = ctx.resuccess(data)
  } catch (err) {
    ctx.body = ctx.refail({
      message: 'json数据不正确'
    })
  } finally {
    del(filePath)
  }
}
