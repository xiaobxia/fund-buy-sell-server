const Proxy = require('../proxy')
const webDataUtil = require('../util/webDataUtil')
const numberUtil = require('../util/numberUtil')
const indexList = require('../const/indexList')
const indexInfoUtilXiong = require('../util/indexInfoUtilXiong')
const indexInfoUtilJian = require('../util/indexInfoUtilJian')
const codeList = indexList.list

const IndexFund = Proxy.IndexFund
// 详细
const codeMap = indexInfoUtilXiong.codeMap
const InfoUtil = indexInfoUtilXiong.Util
const fnMap = indexInfoUtilXiong.fnMap
const formatData = indexInfoUtilXiong.formatData
// 简易版
const InfoUtilJian = indexInfoUtilJian.Util
const fnMapJian = indexInfoUtilJian.fnMap

function getIndexFlag (list, item) {
  const info = formatData(list)
  const infoUtil = new InfoUtil(item)
  const infoUtilJian = new InfoUtilJian(item)
  const recentNetValue = info.list
  let infoList = []
  let classInfo = ''
  // 高风偏波段
  let infoListHigh = []
  let classInfoHigh = ''
  let resData = {}
  // 近的在前
  for (let i = 0; i < 8; i++) {
    const nowRecord = recentNetValue[i]
    const oneDayRecord = recentNetValue[i + 1]
    const twoDayRecord = recentNetValue[i + 2]
    let buyFlag = infoUtil[fnMap[item.key + 'Buy']](nowRecord, oneDayRecord, twoDayRecord)
    let sellFlag = infoUtil[fnMap[item.key + 'Sell']](nowRecord, oneDayRecord, twoDayRecord)
    let buyFlagJian = infoUtilJian[fnMapJian[item.key + 'Buy']](nowRecord, oneDayRecord, twoDayRecord)
    let sellFlagJian = infoUtilJian[fnMapJian[item.key + 'Sell']](nowRecord, oneDayRecord, twoDayRecord)
    if (i < 5) {
      if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
        infoList[i] = '买'
        if (classInfo === '') {
          classInfo = 'buy'
        }
        // 详细版
      } else if ((sellFlag === true) || (sellFlag !== false && sellFlag.flag === true)) {
        infoList[i] = '卖'
        if (classInfo === '') {
          classInfo = 'sell'
        }
        // 简易版
      } else if ((sellFlagJian === true) || (sellFlagJian !== false && sellFlagJian.flag === true)) {
        infoList[i] = '卖'
        if (classInfo === '') {
          classInfo = 'sell'
        }
      } else {
        infoList[i] = ''
      }
    } else {
      if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
        if (classInfo === '') {
          classInfo = 'buy'
        }
      } else if ((sellFlag === true) || (sellFlag !== false && sellFlag.flag === true)) {
        if (classInfo === '') {
          classInfo = 'sell'
        }
      } else if ((sellFlagJian === true) || (sellFlagJian !== false && sellFlagJian.flag === true)) {
        if (classInfo === '') {
          classInfo = 'sell'
        }
      }
    }
    // 高分偏部分
    if (i < 5) {
      if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
        infoListHigh[i] = '买'
        if (classInfoHigh === '') {
          classInfoHigh = 'buy'
        }
        // 详细版
      } else if ((buyFlagJian === true) || (buyFlagJian !== false && buyFlagJian.flag === true)) {
        infoListHigh[i] = '买'
        if (classInfoHigh === '') {
          classInfoHigh = 'buy'
        }
        // 详细版
      } else if ((sellFlag === true) || (sellFlag !== false && sellFlag.flag === true)) {
        infoListHigh[i] = '卖'
        if (classInfoHigh === '') {
          classInfoHigh = 'sell'
        }
        // 简易版
      } else if ((sellFlagJian === true) || (sellFlagJian !== false && sellFlagJian.flag === true)) {
        infoListHigh[i] = '卖'
        if (classInfoHigh === '') {
          classInfoHigh = 'sell'
        }
      } else {
        infoListHigh[i] = ''
      }
    } else {
      if ((buyFlag === true) || (buyFlag !== false && buyFlag.flag === true)) {
        if (classInfoHigh === '') {
          classInfoHigh = 'buy'
        }
      } else if ((buyFlagJian === true) || (buyFlagJian !== false && buyFlagJian.flag === true)) {
        if (classInfoHigh === '') {
          classInfoHigh = 'buy'
        }
      } else if ((sellFlag === true) || (sellFlag !== false && sellFlag.flag === true)) {
        if (classInfoHigh === '') {
          classInfoHigh = 'sell'
        }
      } else if ((sellFlagJian === true) || (sellFlagJian !== false && sellFlagJian.flag === true)) {
        if (classInfoHigh === '') {
          classInfoHigh = 'sell'
        }
      }
    }
  }
  resData.buySell = infoList
  resData.buySellHigh = infoListHigh
  let firstClass = ''
  if (infoList[0] === '买') {
    firstClass = 'buy'
  }
  if (infoList[0] === '卖') {
    firstClass = 'sell'
  }
  let firstClassHigh = ''
  if (infoListHigh[0] === '买') {
    firstClassHigh = 'buy'
  }
  if (infoListHigh[0] === '卖') {
    firstClassHigh = 'sell'
  }
  resData.kline = recentNetValue.slice(0, 5)
  resData.firstClass = firstClass
  resData.firstClassHigh = firstClassHigh
  resData.rate = numberUtil.keepTwoDecimals(recentNetValue[0].netChangeRatio)
  return resData
}

exports.updateBand = async function () {
  let opList = []
  for (let i = 0; i < codeList.length; i++) {
    const codeItem = codeList[i]
    if (codeItem.type === 1) {
      const res = await webDataUtil.getStockAllTenxun({
        code: codeItem.code,
        days: 12
      })
      const indexRes = {
        codeMap: codeMap[codeItem.key],
        ...codeItem,
        ...getIndexFlag(res.list, {
          key: codeItem.key,
          ...codeMap[codeItem.key]
        })
      }
      opList.push(
        IndexFund.update({ code: codeItem.code, type: 1 }, {
          detail: indexRes
        })
      )
    }
  }
  return Promise.all(opList)
}

exports.getBand = async function () {
  return IndexFund.find({ type: 1 })
}
