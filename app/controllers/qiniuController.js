const qiniuUtil = require('../common/qiniu')

exports.getUploadToken = async function (ctx) {
  try {
    const res = qiniuUtil.getUploadToken(ctx.localConfig.qiniu)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
