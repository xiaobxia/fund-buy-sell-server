const Proxy = require('../proxy')
const webDataUtil = require('../util/webDataUtil')
const numberUtil = require('../util/numberUtil')
const indexList = require('../const/indexList')
const platformFixedInvestment = require('../util/platformFixedInvestment')
const codeList = indexList.list

const IndexFund = Proxy.IndexFund

const codeMap = platformFixedInvestment.codeMap
const InfoUtil = platformFixedInvestment.Util
const fnMap = platformFixedInvestment.fnMap
const formatData = platformFixedInvestment.formatData

function getIndexFlag (list, item) {
  const info = formatData(list)
  const infoUtil = new InfoUtil(item)
  const recentNetValue = info.list
  let infoList = []
  let classInfo = ''
  let resData = {}
  // 近的在前
  for (let i = 0; i < 8; i++) {
    const nowRecord = recentNetValue[i]
    const oneDayRecord = recentNetValue[i + 1]
    const twoDayRecord = recentNetValue[i + 2]
    let buyFlag = infoUtil[fnMap[item.key + 'Buy']](nowRecord, oneDayRecord, twoDayRecord)
    if (i < 5) {
      if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
        infoList[i] = '买'
        if (classInfo === '') {
          classInfo = 'buy'
        }
      } else {
        infoList[i] = ''
      }
    } else {
      if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
        if (classInfo === '') {
          classInfo = 'buy'
        }
      }
    }
  }
  resData.buySell = infoList
  let firstClass = ''
  if (infoList[0] === '买') {
    firstClass = 'buy'
  }
  resData.kline = recentNetValue.slice(0, 5)
  resData.firstClass = firstClass
  resData.rate = numberUtil.keepTwoDecimals(recentNetValue[0].netChangeRatio)
  return resData
}

exports.updateFixedInvestment = async function () {
  let opList = []
  for (let i = 0; i < codeList.length; i++) {
    const codeItem = codeList[i]
    if (codeItem.type === 2) {
      const res = await webDataUtil.getStockAllTenxun({
        code: codeItem.code,
        days: 12
      })
      const indexRes = {
        ...codeItem,
        ...getIndexFlag(res.list, {
          key: codeItem.key,
          ...codeMap[codeItem.key]
        })
      }
      opList.push(
        IndexFund.update({ code: codeItem.code, type: 2 }, {
          detail: indexRes
        })
      )
    }
  }
  return Promise.all(opList)
}

exports.getFixedInvestment = async function () {
  return IndexFund.find({ type: 2 })
}
