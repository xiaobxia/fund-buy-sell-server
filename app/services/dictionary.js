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
