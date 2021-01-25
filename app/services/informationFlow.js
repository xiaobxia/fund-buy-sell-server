const Proxy = require('../proxy')

const InformationFlowProxy = Proxy.InformationFlow
const UserProxy = Proxy.User

/**
 * 更新信息流信息
 * @param data
 * @returns {Promise<*>}
 */
exports.updateInfoFlow = async function (data) {
  const updateData = {
    content: data.content,
    is_vip: data.is_vip
  }
  if (data.id) {
    const record = await InformationFlowProxy.findOne({
      _id: data.id
    })
    if (record) {
      // 更新
      return InformationFlowProxy.update({
        _id: data.id
      }, updateData)
    } else {
      // 新增
      return InformationFlowProxy.newAndSave({
        ...updateData
      })
    }
  } else {
    // 新增
    return InformationFlowProxy.newAndSave({
      ...updateData
    })
  }
}

/**
 * 对信息流点赞
 * @param data
 * @returns {Promise<*>}
 */
exports.addLike = async function (data) {
  return InformationFlowProxy.update({
    _id: data.info_id
  }, { $addToSet: { user_like: data.user_id } })
}

/**
 * 对信息流取消点赞
 * @param data
 * @returns {Promise<*>}
 */
exports.disLike = async function (data) {
  return InformationFlowProxy.update({
    _id: data.info_id
  }, { $pull: { user_like: data.user_id } })
}

/**
 * 获取用户信息流
 * @param query
 * @param paging
 * @returns {Promise<{count: any, list: Array}>}
 */
exports.getUserInfoFlow = async function (query, paging) {
  const user = await UserProxy.findOne({ _id: query.user_id })
  const opt = {
    skip: paging.start,
    limit: paging.offset,
    sort: {
      create_at: -1
    }
  }
  const fetchData = await Promise.all([
    InformationFlowProxy.find({}, opt),
    InformationFlowProxy.count({})
  ])
  const list = fetchData[0]
  const newList = []
  list.forEach((v) => {
    const newData = {
      content: v.content,
      id: v.id,
      is_vip: v.is_vip,
      create_at: v.create_at
    }
    if (v.is_vip) {
      if (!user.vip_days) {
        newData.content = ''
      }
    }
    newList.push(newData)
  })
  return { list: newList, count: fetchData[1] }
}

/**
 * 获取管理员信息流
 * @param query
 * @param paging
 * @returns {Promise<{count: any, list: any}>}
 */
exports.getAdminInfoFlow = async function (query, paging) {
  const opt = {
    skip: paging.start,
    limit: paging.offset,
    sort: {
      create_at: -1
    }
  }
  let queryOption = {
  }
  if (query.beginTime) {
    queryOption.create_at = {
      $gte: query.beginTime,
      $lt: query.endTime
    }
  }
  // 模糊匹配
  if (query.search) {
    queryOption.content = new RegExp(query.search, 'i')
  }
  if (query.is_vip === true || query.is_vip === false) {
    queryOption.is_vip = query.is_vip
  }
  const fetchData = await Promise.all([
    InformationFlowProxy.find(queryOption, opt),
    InformationFlowProxy.count(queryOption)
  ])
  const list = fetchData[0]
  const newList = []
  list.forEach((v) => {
    const newData = {
      content: v.content,
      id: v.id,
      is_vip: v.is_vip,
      create_at: v.create_at,
      like_count: v.user_like.length
    }
    newList.push(newData)
  })
  return { list: newList, count: fetchData[1] }
}
