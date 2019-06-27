const Proxy = require('../proxy')

const AdvertisementProxy = Proxy.Advertisement

exports.getAdvertisements = async function (query, paging) {
  const opt = {
    skip: paging.start,
    limit: paging.offset,
    sort: {
      status: 1,
      create_at: -1
    }
  }
  let queryOption = {}
  if (query.type) {
    queryOption.type = query.type
  }
  if (query.status) {
    queryOption.status = query.status
  }
  const fetchData = await Promise.all([
    AdvertisementProxy.find(queryOption, opt),
    AdvertisementProxy.count(queryOption)
  ])
  const list = fetchData[0]
  return { list: list, count: fetchData[1] }
}

exports.addAdvertisement = async function (data) {
  return AdvertisementProxy.newAndSave({
    type: data.type,
    img_url: data.img_url,
    status: 1
  })
}

exports.updateStatus = async function (data) {
  return AdvertisementProxy.update({
    _id: data.id
  }, {
    status: data.status
  })
}
