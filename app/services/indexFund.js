const Proxy = require('../proxy')
const webDataUtil = require('../util/webDataUtil')
const numberUtil = require('../util/numberUtil')
const indexList = require('../const/indexList')
const fixedInvestment = require('../util/fixedInvestment')
const codeList = indexList.list

const IndexFund = Proxy.IndexFund

const codeMap = fixedInvestment.codeMap
const InfoUtil = fixedInvestment.Util
const fnMap = fixedInvestment.fnMap
const formatData = fixedInvestment.formatData

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
    // let sellFlag = infoUtil[fnMap[item.key + 'Sell']](nowRecord, oneDayRecord, twoDayRecord)
    if (i < 5) {
      if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
        if (recentNetValue[i].netChangeRatio <= -(2 * item.rate)) {
          infoList[i] = '买'
          if (classInfo === '') {
            classInfo = 'buy'
          }
        }
      // } else if ((sellFlag === true) || (sellFlag !== false && sellFlag.flag === true)) {
      //   infoList[i] = '卖'
      //   if (classInfo === '') {
      //     classInfo = 'sell'
      //   }
      } else {
        infoList[i] = ''
      }
    } else {
      if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
        if (classInfo === '') {
          classInfo = 'buy'
        }
      }
      // else if ((sellFlag === true) || (sellFlag !== false && sellFlag.flag === true)) {
      //   if (classInfo === '') {
      //     classInfo = 'sell'
      //   }
      // }
    }
  }
  resData.buySell = infoList
  let firstClass = ''
  if (infoList[0] === '买') {
    firstClass = 'buy'
  }
  // if (infoList[0] === '卖') {
  //   firstClass = 'sell'
  // }
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
