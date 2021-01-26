const Proxy = require('../proxy')

const Dictionary = Proxy.Dictionary

/**
 * 通过键获取字典
 * @param key
 * @returns {Promise.<void>}
 */
exports.getByKey = async function (key) {
  return Dictionary.findOne({ key })
}

/**
 * 通过键更新字典
 * @param key
 * @param data
 * @returns {Promise<*>}
 */
exports.updateByKey = async function (key, data) {
  return Dictionary.update({
    key: key
  }, data)
}
