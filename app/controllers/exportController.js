const xlsx = require('node-xlsx')

/**
 * 导出数字
 * @param ctx
 * @returns {Promise<void>}
 */
exports.exportNumbers = async function (ctx) {
  try {
    let list = []
    for (let i = 0; i < 10; i++) {
      list.push({
        number: i
      })
    }
    ctx.body = {
      list
    }
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}

/**
 * 导出xlsx
 * @param ctx
 * @returns {Promise<void>}
 */
exports.exportXlsx = async function (ctx) {
  try {
    const data = [
      ['姓名', '性别', '年龄'],
      ['小a', '男', 21],
      ['小b', '女', 22],
      ['小c', '男', 23]
    ]
    ctx.body = xlsx.build([{ name: '人员', data: data }])
  } catch (err) {
    ctx.body = ctx.refail(err)
  }
}
