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

exports.getFixedInvestmentContent = async function () {
  return Dictionary.findOne({ key: 'fixedInvestmentContent' })
}

exports.updateFixedInvestmentContent = async function (data) {
  return Dictionary.update({ key: 'fixedInvestmentContent' }, {
    value: data.content
  })
}

exports.getAllContent = async function () {
  const contents = await Promise.all([
    Dictionary.findOne({ key: 'fixedInvestmentContent' }),
    Dictionary.findOne({ key: 'positionContent' }),
    Dictionary.findOne({ key: 'marketWarn' })
  ])
  return {
    fixedInvestmentContent: contents[0] && contents[0].value,
    positionContent: contents[1] && contents[1].value,
    marketWarn: contents[2] && contents[2].value
  }
}

exports.updateAllContent = async function (data) {
  let opList = []
  if (data.fixedInvestmentContent) {
    opList.push(
      Dictionary.update({ key: 'fixedInvestmentContent' }, {
        value: data.fixedInvestmentContent
      })
    )
  }
  if (data.positionContent) {
    opList.push(
      Dictionary.update({ key: 'positionContent' }, {
        value: data.positionContent
      })
    )
  }
  if (data.marketWarn) {
    opList.push(
      Dictionary.update({ key: 'marketWarn' }, {
        value: data.marketWarn
      })
    )
  }
  return Promise.all(opList)
}

exports.getBandContent = async function () {
  const contents = await Promise.all([
    Dictionary.findOne({ key: 'positionContent' }),
    Dictionary.findOne({ key: 'marketWarn' })
  ])
  return {
    positionContent: contents[0] && contents[0].value,
    marketWarn: contents[1] && contents[1].value
  }
}
