exports.getFixedInvestmentContent = async function (ctx) {
  try {
    const content = await ctx.services.dictionary.getFixedInvestmentContent()
    ctx.body = ctx.resuccess(content)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.updateFixedInvestmentContent = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      content: { required: true, type: 'string' }
    }, query)
    await ctx.services.dictionary.updateFixedInvestmentContent(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getAllContent = async function (ctx) {
  try {
    const content = await ctx.services.dictionary.getAllContent()
    ctx.body = ctx.resuccess(content)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.updateAllContent = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      fixedInvestmentContent: { required: false, type: 'string' },
      positionContent: { required: false, type: 'string' },
      marketWarn: { required: false, type: 'string' }
    }, query)
    await ctx.services.dictionary.updateAllContent(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getBandContent = async function (ctx) {
  try {
    const content = await ctx.services.dictionary.getBandContent()
    ctx.body = ctx.resuccess(content)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
