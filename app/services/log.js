const Proxy = require('../proxy')

const LogAuditProxy = Proxy.LogAudit

/**
 * 添加日志
 * @param data
 * @returns {Promise<*>}
 */
exports.addLogAudit = async function (data) {
  return LogAuditProxy.newAndSave(data)
}
