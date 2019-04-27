module.exports = function (err, ctx) {
  // 只用于记录应用级错误
  ctx.logger.warn('in error handler')
  ctx.logger.error(err)
}
