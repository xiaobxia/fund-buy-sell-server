const tableFields = require('../models/tableFields')

const customerUpdateValidateModel = tableFields.createUpdateValidateModel(
  tableFields.customer.update
)

exports.getAdminUsers = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      current: { type: 'int', required: true },
      pageSize: { type: 'int', required: true }
    }, query)
    let paging = ctx.paging(data.current, data.pageSize)
    const users = await ctx.services.user.getAdminUsers(paging)
    ctx.body = ctx.resuccess(users)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.addAdminUser = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
      roles: { type: 'string', required: true }
    }, query)
    await ctx.services.user.addAdminUser(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.deleteAdminUser = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      user_id: { type: 'string', required: true }
    }, query)
    await ctx.services.user.deleteAdminUser(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
/**
 * 修改登录密码
 * @param ctx
 * @returns {Promise<void>}
 */
exports.newPassword = async function (ctx) {
  const query = ctx.request.body
  try {
    const tokenRaw = ctx.tokenRaw
    const data = ctx.validateData({
      oldPassword: { required: true, type: 'string' },
      newPassword: { required: true, type: 'string' }
    }, query)
    await ctx.services.user.newPassword({
      name: tokenRaw.name,
      ...data
    })
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getCustomers = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      current: { type: 'int', required: true },
      pageSize: { type: 'int', required: true },
      name: { type: 'string', required: false },
      wechat: { type: 'string', required: false },
      status: { type: 'int', required: false },
      todayQuery: { type: 'boolean', required: false },
      sort: { type: 'string', required: false },
      beginTime: { required: false, type: 'string' },
      endTime: { required: false, type: 'string' }
    }, query)
    let paging = ctx.paging(data.current, data.pageSize)
    const customers = await ctx.services.user.getCustomers(data, paging)
    ctx.body = ctx.resuccess(customers)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.addCustomer = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      buy_type: { type: 'string', required: true },
      name: { type: 'string', required: true },
      can_use_day: { type: 'int', required: true }
    }, query)
    await ctx.services.user.addCustomer(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.deleteCustomer = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      id: { type: 'string', required: true }
    }, query)
    await ctx.services.user.deleteCustomer(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.getCustomer = async function (ctx) {
  const query = ctx.query
  try {
    const data = ctx.validateData({
      id: { type: 'string', required: true }
    }, query)
    const res = await ctx.services.user.getCustomer(data)
    ctx.body = ctx.resuccess(res)
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.updateCustomer = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      _id: { type: 'string', required: true },
      ...customerUpdateValidateModel
    }, query)
    await ctx.services.user.updateCustomer(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.giveGiftCanUseDay = async function (ctx) {
  try {
    await ctx.services.user.giveGiftCanUseDay()
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

exports.giveVacationCanUseDay = async function (ctx) {
  const query = ctx.request.body
  try {
    const data = ctx.validateData({
      day: { type: 'int', required: true }
    }, query)
    await ctx.services.user.giveVacationCanUseDay(data)
    ctx.body = ctx.resuccess()
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
