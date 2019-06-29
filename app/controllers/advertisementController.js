exports.getAdvertisements = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      current: { type: 'int', required: true },
      pageSize: { type: 'int', required: true },
      type: { type: 'string', required: false },
      status: { type: 'int', required: false }
    }, query)
    let paging = ctx.paging(data.current, data.pageSize)
    const advertisements = await ctx.services.advertisement.getAdvertisements(data, paging)
    ctx.body = ctx.resuccess(advertisements)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.addAdvertisement = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      type: { type: 'string', required: true },
      img_url: { type: 'string', required: true },
      sortIndex: { type: 'int', required: true }
    }, query)
    await ctx.services.advertisement.addAdvertisement(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.updateAdvertisement = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      _id: { type: 'string', required: true },
      type: { type: 'string', required: false },
      img_url: { type: 'string', required: false },
      sortIndex: { type: 'int', required: false },
      status: { type: 'int', required: false }
    }, query)
    await ctx.services.advertisement.updateAdvertisement(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.updateStatus = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      id: { type: 'string', required: true },
      status: { type: 'int', required: true }
    }, query)
    await ctx.services.advertisement.updateStatus(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.deleteAdvertisement = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      _id: { type: 'string', required: true }
    }, query)
    await ctx.services.advertisement.deleteAdvertisement(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
