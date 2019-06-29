const Proxy = require('../proxy')

const AdvertisementProxy = Proxy.Advertisement

exports.getAdvertisements = async function (query, paging) {
  const opt = {
    skip: paging.start,
    limit: paging.offset,
    sort: {
      sortIndex: 1,
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
    status: 1,
    sortIndex: data.sortIndex
  })
}

exports.updateAdvertisement = async function (data) {
  let updateData = {}
  if (data.type) {
    updateData.type = data.type
  }
  if (data.img_url) {
    updateData.img_url = data.img_url
  }
  if (data.sortIndex) {
    updateData.sortIndex = data.sortIndex
  }
  if (data.status) {
    updateData.status = data.status
  }
  return AdvertisementProxy.update({
    _id: data._id
  }, updateData)
}

exports.updateStatus = async function (data) {
  return AdvertisementProxy.update({
    _id: data.id
  }, {
    status: data.status
  })
}

exports.deleteAdvertisement = async function (data) {
  return AdvertisementProxy.delete({
    _id: data._id
  })
}
