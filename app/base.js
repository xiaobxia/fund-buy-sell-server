const reqlib = require('app-root-path').require
const localConfig = reqlib('/config')
const localConst = require('./const')
const logger = require('./common/logger')
const services = require('./services')
const sendMail = require('./common/email')
const jwt = require('jsonwebtoken')
const fs = require('fs-extra')
const Parameter = require('./lib/validate')
const schedules = require('./schedules/inedx')

const parameter = new Parameter()

const codeMap = {
  '-1': 'fail',
  '200': 'success',
  '401': 'token expired',
  '403': 'forbidden',
  '500': 'server error',
  '10001': 'params error'
}

module.exports = function (app) {
  const content = app.context
  // 配置
  content.localConfig = localConfig
  // 常量
  content.localConst = localConst
  // 日志
  content.logger = logger
  // 发邮件
  content.sendMail = sendMail
  // 成功
  content.resuccess = function (data) {
    return {
      code: 200,
      success: true,
      message: codeMap['200'],
      data: data
    }
  }
  // 失败
  content.refail = function (err, data) {
    logger.warn(err)
    const message = err.message
    const code = err.code || '-1'
    return {
      code: parseInt(code),
      success: false,
      message: message || codeMap[code || '-1'] || codeMap['-1'],
      data: data
    }
  }
  // 过滤请求字段
  content.queryDataFilter = function (rawData, filterKey) {
    let newData = {}
    for (let key in rawData) {
      if (filterKey !== key) {
        newData[key] = rawData[key]
      }
    }
    return rawData
  }
  // 接口参数验证
  content.validateData = function (rule, data) {
    let fake = {}
    for (let key in rule) {
      if (rule.hasOwnProperty(key)) {
        if (data[key] !== undefined) {
          let type = rule[key].type
          if (type === 'int') {
            fake[key] = data[key] ? parseInt(data[key], 10) : data[key]
          } else if (type === 'number') {
            fake[key] = data[key] ? parseFloat(data[key]) : data[key]
          } else {
            if (!type) {
              rule[key].type = 'string'
            }
            fake[key] = data[key]
          }
        }
      }
    }
    let msgList = parameter.validate(rule, fake)
    if (msgList !== undefined) {
      let msg = msgList[0]
      let err = new Error(msg.field + ' ' + msg.message)
      err.code = '10001'
      throw err
    } else {
      return fake
    }
  }
  // token
  content.token = {}
  // token注册
  content.token.sign = function (data, expiresIn) {
    const tokenConfig = localConfig.server.token
    return jwt.sign(data, tokenConfig.key, { expiresIn: expiresIn || tokenConfig.expiresIn })
  }
  // token验证
  content.token.verify = function (token) {
    const tokenConfig = localConfig.server.token
    return jwt.verify(token, tokenConfig.key)
  }
  // 验证接口权限
  function checkIn (userRoles, roleList) {
    for (let i = 0; i < userRoles.length; i++) {
      const userRole = userRoles[i]
      for (let j = 0; j < userRoles.length; j++) {
        const roleItem = roleList[j]
        if (roleItem === userRole) {
          return true
        }
      }
    }
  }
  content.checkPermission = function (userRoles, roleMap) {
    // roles :{include, exclude}
    if (roleMap) {
      let permission = true
      const include = roleMap.include
      const exclude = roleMap.exclude
      // 存在于include
      if (include) {
        permission = checkIn(userRoles, include)
      }
      // 存在于exclude
      if (exclude && checkIn(userRoles, exclude)) {
        permission = false
      }
      // exclude有决定权
      if (permission) {
        return true
      } else {
        let err = new Error()
        err.code = '403'
        throw err
      }
    } else {
      // 没有权限要求
      return true
    }
  }
  // 服务
  content.services = services
  // 创建json文件
  content.createJsonFile = function (fileName, fileData) {
    return fs.ensureFile(fileName).then(() => {
      return fs.writeJson(fileName, fileData, { spaces: 2 })
    })
  }
  // 定时任务
  content.schedules = schedules
  // 分页
  content.paging = function (current, pageSize, defaultValue) {
    let defaultCurrent = 1
    let defaultPageSize = 10
    if (defaultValue) {
      defaultCurrent = defaultValue.current || defaultCurrent
      defaultPageSize = defaultValue.pageSize || defaultPageSize
    }
    // 得是个整数
    let currentT = parseInt(current, 10)
    let pageSizeT = parseInt(pageSize, 10)
    let index = isNaN(currentT) ? defaultCurrent : currentT
    let size = isNaN(pageSizeT) ? defaultPageSize : pageSizeT
    return {
      current: index,
      pageSize: size,
      start: (index - 1) * size,
      offset: size
    }
  }
}
