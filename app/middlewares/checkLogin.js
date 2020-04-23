const filterPath = ['/auth', '/schedule', '/test']

module.exports = async function (ctx, next) {
  const path = ctx.path
  const projectName = ctx.localConfig.project.projectName
  let ifFilter = false
  for (let k = 0; k < filterPath.length; k++) {
    if (path.startsWith(`/${projectName}${filterPath[k]}`)) {
      ifFilter = true
      break
    }
  }
  if (path === `/${projectName}` || path === `/${projectName}/`) {
    ifFilter = true
  }
  if (ifFilter) {
    ctx.logger.trace('in filter route')
    await next()
  } else {
    ctx.logger.trace('in check route')
    const token = ctx.header.token || ''
    try {
      ctx.tokenRaw = ctx.token.verify(token)
    } catch (err) {
      ctx.logger.trace('in token error')
      ctx.body = ctx.refail({
        code: '401'
      })
      return
    }
    await next()
  }
}
