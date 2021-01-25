const Proxy = require('../proxy')

const InformationFlowProxy = Proxy.InformationFlow

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
