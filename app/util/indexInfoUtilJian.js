/**
 * Created by xiaobxia on 2018/6/28.
 */
const numberUtil = require('./numberUtil')

function ifMatch (raw, target) {
  let match = true
  for (let key in target) {
    if (target[key] !== raw[key]) {
      match = false
      break
    }
  }
  return match
}

function Util (config) {
  this.threshold = config.threshold
  this.rate = config.rate
  this.wave = config.wave
}

Util.prototype = {
  getFlag: function (record) {
    let flag = {}
    flag.ifUpOpen = this.ifUpOpen(record)
    flag.ifOpenHigh = this.ifOpenHigh(record)
    flag.ifUpClose = this.ifUpClose(record)
    flag.ifCloseHigh = this.ifCloseHigh(record)
    flag.ifSessionDown = this.ifSessionDown(record)
    flag.ifSessionUpClose = this.ifSessionUpClose(record)
    flag.ifSessionUp = this.ifSessionUp(record)
    flag.ifSessionDownClose = this.ifSessionDownClose(record)
    flag.ifHighPreCloseDown = this.ifHighPreCloseDown(record)
    return flag
  },
  // 是否高开
  ifUpOpen: function (record) {
    const preClose = record.preClose
    const open = record.open
    return open >= preClose
  },
  // 是否开盘高幅度
  ifOpenHigh: function (record) {
    const rate = this.rate
    const preClose = record.preClose
    const open = record.open
    return Math.abs(numberUtil.countDifferenceRate(open, preClose)) >= rate
  },
  // 是否上涨
  ifUpClose: function (record) {
    return record.netChangeRatio > 0
  },
  // 是否大幅上涨
  ifCloseHigh: function (record) {
    const rate = this.rate
    return Math.abs(record.netChangeRatio) >= rate
  },
  // 盘中下跌
  ifSessionDown: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.low, record.preClose) <= -wave
  },
  // 收盘拉起
  ifSessionUpClose: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.close, record.low) >= wave
  },
  // 盘中上升
  ifSessionUp: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.high, record.preClose) >= wave
  },
  // 收盘回落
  ifSessionDownClose: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.close, record.high) <= -wave
  },
  // 无抵抗下跌
  ifHighPreCloseDown: function (record) {
    const rate = this.rate
    return numberUtil.countDifferenceRate(record.high, record.preClose) < -rate
  },
  ifSellChuangye: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    return false
  },
  ifBuyChuangye: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-2-0'
        }
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return {
          flag: true,
          text: 'buy-2-1'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-3-0'
        }
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return {
          flag: true,
          text: 'buy-3-1'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    return false
  },
  ifBuyGangtie: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-6-0'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    return false
  },
  ifSellGangtie: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    return false
  },
  ifBuyJungong: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return {
          flag: true,
          text: 'buy-4-0'
        }
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-4-1'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    return false
  },
  ifSellJungong: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    return false
  },
  ifBuyYiyao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    return false
  },
  ifSellYiyao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    return false
  },
  ifBuyMeitan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    return false
  },
  ifSellMeitan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    return false
  },
  ifBuyYouse: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    return false
  },
  ifSellYouse: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    return false
  },
  ifBuyJisuanji: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-0-0'
        }
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-0-1'
        }
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-0-2'
        }
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-0-3'
        }
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-0-4'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    return false
  },
  ifSellJisuanji: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    return false
  },
  ifBuyBaijiu: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return {
          flag: true,
          text: 'buy-2-0'
        }
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-2-0'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    return false
  },
  ifSellBaijiu: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    return false
  },
  ifBuyXinxi: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    return false
  },
  ifSellXinxi: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    return false
  },
  ifBuyXiaofei: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return {
          flag: true,
          text: 'buy-5-0'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    return false
  },
  ifSellXiaofei: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    return false
  },
  ifBuyBaoxian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    return false
  },
  ifSellBaoxian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    return false
  },
  ifBuyWulin: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    return false
  },
  ifSellWulin: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    return false
  },
  ifBuyChuanmei: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    return false
  },
  ifSellChuanmei: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    return false
  },
  ifBuyDianzi: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    return false
  },
  ifSellDianzi: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    return false
  },
  ifBuyYiliao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    return false
  },
  ifSellYiliao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    return false
  },
  ifBuyShengwu: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return {
          flag: true,
          text: 'buy-8-0'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    return false
  },
  ifSellShengwu: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    return false
  },
  ifBuySanbai: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    return false
  },
  ifSellSanbai: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    return false
  },
  ifBuyWubai: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    return false
  },
  ifSellWubai: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    return false
  },
  ifBuyYinhang: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-3-0'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    return false
  },
  ifSellYinhang: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    return false
  },
  ifBuyDichan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    return false
  },
  ifSellDichan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    return false
  },
  ifBuyZhengquan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-2-0'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    return false
  },
  ifSellZhengquan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    return false
  },
  ifBuyJijian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return {
          flag: true,
          text: 'buy-0-0'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return {
          flag: true,
          text: 'buy-2-0'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    return false
  },
  ifSellJijian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    return false
  },
  ifBuyHuanbao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return {
          flag: true,
          text: 'buy-6-0'
        }
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    return false
  },
  ifSellHuanbao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    return false
  },
  ifBuyQiche: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    return false
  },
  ifSellQiche: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    return false
  },
  ifBuyYiqian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    return false
  },
  ifSellYiqian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      if (ifMatch(lastDay,
        { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': true }
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': true, 'ifSessionUp': true, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      { 'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionUpClose': true, 'ifSessionUp': false, 'ifSessionDownClose': false }
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    return false
  }
}

const codeMap = {
  'chuangye': {
    code: 'sz399006',
    name: '创业',
    threshold: 0.99,
    wave: 0.99,
    rate: 0.99,
    mix: true,
    up: 136.55,
    upDay: 117,
    down: -165.46,
    downDay: 148,
    incomeHighRate: true,
    noLong: true
  },
  'gangtie': {
    code: 'sz399440',
    name: '钢铁',
    threshold: 0.88,
    wave: 0.88,
    rate: 0.875,
    up: 135.67,
    upDay: 135,
    down: -163.66,
    downDay: 130,
    stable: true
  },
  'jungong': {
    code: 'sz399959',
    name: '军工',
    attach: 'chuangye',
    threshold: 0.97,
    wave: 1.0298226950354608,
    rate: 0.903150684931507,
    up: 138.31,
    upDay: 129,
    down: -165.67,
    downDay: 136
  },
  'yiyao': {
    code: 'sh000037',
    name: '医药',
    attach: 'chuangye',
    threshold: 0.94,
    rate: 0.9339416058394158,
    wave: 0.9391726618705037,
    up: 160.94,
    upDay: 121,
    down: -184.03,
    downDay: 144,
    incomeHighRate: true,
    noLong: true
  },
  'meitan': {
    code: 'sz399998',
    name: '煤炭',
    threshold: 0.81,
    wave: 0.8196071428571425,
    rate: 0.800408163265306,
    up: 142.32,
    upDay: 130,
    down: -170.53,
    downDay: 135
  },
  'youse': {
    code: 'sh000823',
    name: '有色',
    threshold: 0.92,
    wave: 0.8558865248226952,
    rate: 0.9762650602409638,
    up: 124.79,
    upDay: 129,
    down: -158.25,
    downDay: 136
  },
  'jisuanji': {
    code: 'sz399363',
    name: '计算机',
    attach: 'chuangye',
    threshold: 1.04,
    rate: 0.9923308270676693,
    wave: 1.0808712121212116,
    up: 167.10,
    upDay: 119,
    down: -196.42,
    downDay: 146,
    incomeHighRate: true,
    noLong: true
  },
  'baijiu': {
    code: 'sz399997',
    name: '白酒',
    attach: 'wulin',
    threshold: 1.19,
    rate: 1.0296610169491525,
    wave: 1.3582478632478634,
    up: 211.44,
    upDay: 115,
    down: -235.00,
    downDay: 150,
    incomeHighRate: true,
    noLong: true
  },
  'xinxi': {
    code: 'sh000993',
    name: '信息',
    attach: 'chuangye',
    threshold: 1.04,
    rate: 1.074,
    wave: 1.0134768211920533,
    up: 144.75,
    upDay: 117,
    down: -180.78,
    downDay: 148,
    incomeHighRate: true,
    noLong: true
  },
  'xiaofei': {
    code: 'sh000990',
    name: '消费',
    attach: 'wulin',
    threshold: 0.97,
    rate: 0.9892814371257483,
    wave: 0.9413607594936705,
    up: 144.33,
    upDay: 124,
    down: -165.08,
    downDay: 141
  },
  'baoxian': {
    code: 'sz399809',
    name: '保险',
    attach: 'wulin',
    threshold: 0.99,
    wave: 1.0300986842105262,
    rate: 0.9583561643835617,
    up: 134.12,
    upDay: 124,
    down: -162.67,
    downDay: 141
  },
  'wulin': {
    code: 'sh000016',
    name: '50',
    threshold: 0.75,
    rate: 0.7405555555555559,
    wave: 0.7563749999999999,
    mix: true,
    up: 115.65,
    upDay: 135,
    down: -133.44,
    downDay: 130,
    stable: true
  },
  'chuanmei': {
    code: 'sz399971',
    name: '传媒',
    attach: 'chuangye',
    threshold: 0.88,
    rate: 0.8535099337748346,
    wave: 0.9043518518518522,
    up: 119.45,
    upDay: 123,
    down: -154.27,
    downDay: 142
  },
  'dianzi': {
    code: 'sz399811',
    name: '电子',
    attach: 'chuangye',
    threshold: 0.94,
    rate: 0.8853900709219857,
    wave: 1.0019867549668875,
    up: 132.40,
    upDay: 115,
    down: -176.17,
    downDay: 150,
    noLong: true
  },
  'yiliao': {
    code: 'sz399989',
    name: '医疗',
    attach: 'chuangye',
    threshold: 1.03,
    wave: 1.125688405797102,
    rate: 0.9364748201438846,
    up: 188.00,
    upDay: 126,
    down: -198.96,
    downDay: 139,
    incomeHighRate: true,
    stable: true
  },
  'shengwu': {
    code: 'sz399441',
    name: '生物',
    attach: 'chuangye',
    threshold: 0.9,
    rate: 0.8244117647058824,
    wave: 0.9843464052287579,
    up: 156.94,
    upDay: 130,
    down: -179.35,
    downDay: 135,
    stable: true
  },
  'sanbai': {
    code: 'sh000300',
    name: '300',
    threshold: 0.71,
    rate: 0.681153846153846,
    wave: 0.73984375,
    mix: true,
    up: 106.64,
    upDay: 128,
    down: -130.22,
    downDay: 137
  },
  'wubai': {
    code: 'sh000905',
    name: '500',
    threshold: 0.77,
    wave: 0.7210576923076923,
    rate: 0.8220000000000003,
    mix: true,
    up: 104.21,
    upDay: 125,
    down: -136.18,
    downDay: 140
  },
  'yinhang': {
    code: 'sz399986',
    name: '银行',
    attach: 'wulin',
    threshold: 0.69,
    rate: 0.6740372670807456,
    wave: 0.7059375,
    up: 115.91,
    upDay: 129,
    down: -127.37,
    downDay: 136,
    stable: true
  },
  'dichan': {
    code: 'sz399393',
    name: '地产',
    attach: 'wulin',
    threshold: 0.95,
    rate: 0.932594936708861,
    wave: 0.9707741935483872,
    up: 152.86,
    upDay: 123,
    down: -175.12,
    downDay: 142,
    incomeHighRate: true
  },
  'zhengquan': {
    code: 'sz399437',
    name: '证券',
    threshold: 0.86,
    rate: 0.8506493506493509,
    wave: 0.8617586206896549,
    up: 125.78,
    upDay: 124,
    down: -154.60,
    downDay: 141
  },
  'jijian': {
    code: 'sz399995',
    name: '基建',
    threshold: 0.6,
    rate: 0.5599350649350648,
    wave: 0.6321472392638036,
    up: 84.87,
    upDay: 111,
    down: -114.35,
    downDay: 154,
    incomeHighRate: true,
    noLong: true
  },
  'huanbao': {
    code: 'sh000827',
    name: '环保',
    threshold: 0.67,
    rate: 0.6970833333333336,
    wave: 0.6393312101910825,
    up: 83.86,
    upDay: 120,
    down: -122.27,
    downDay: 145,
    noLong: true
  },
  'qiche': {
    code: 'sz399432',
    name: '汽车',
    threshold: 0.61,
    rate: 0.5677702702702703,
    wave: 0.6542647058823531,
    up: 78.74,
    upDay: 125,
    down: -114.06,
    downDay: 140
  },
  'yiqian': {
    code: 'sh000852',
    name: '1000',
    threshold: 0.81,
    rate: 0.8312195121951221,
    wave: 0.7816081871345026
  }
}
const fnMap = {
  chuangyeBuy: 'ifBuyChuangye',
  chuangyeSell: 'ifSellChuangye',
  gangtieBuy: 'ifBuyGangtie',
  gangtieSell: 'ifSellGangtie',
  jungongBuy: 'ifBuyJungong',
  jungongSell: 'ifSellJungong',
  yiyaoBuy: 'ifBuyYiyao',
  yiyaoSell: 'ifSellYiyao',
  meitanBuy: 'ifBuyMeitan',
  meitanSell: 'ifSellMeitan',
  youseBuy: 'ifBuyYouse',
  youseSell: 'ifSellYouse',
  jisuanjiBuy: 'ifBuyJisuanji',
  jisuanjiSell: 'ifSellJisuanji',
  baijiuBuy: 'ifBuyBaijiu',
  baijiuSell: 'ifSellBaijiu',
  xinxiBuy: 'ifBuyXinxi',
  xinxiSell: 'ifSellXinxi',
  xiaofeiBuy: 'ifBuyXiaofei',
  xiaofeiSell: 'ifSellXiaofei',
  baoxianBuy: 'ifBuyBaoxian',
  baoxianSell: 'ifSellBaoxian',
  wulinBuy: 'ifBuyWulin',
  wulinSell: 'ifSellWulin',
  chuanmeiBuy: 'ifBuyChuanmei',
  chuanmeiSell: 'ifSellChuanmei',
  dianziBuy: 'ifBuyDianzi',
  dianziSell: 'ifSellDianzi',
  yiliaoBuy: 'ifBuyYiliao',
  yiliaoSell: 'ifSellYiliao',
  shengwuBuy: 'ifBuyShengwu',
  shengwuSell: 'ifSellShengwu',
  sanbaiBuy: 'ifBuySanbai',
  sanbaiSell: 'ifSellSanbai',
  wubaiBuy: 'ifBuyWubai',
  wubaiSell: 'ifSellWubai',
  yinhangBuy: 'ifBuyYinhang',
  yinhangSell: 'ifSellYinhang',
  dichanBuy: 'ifBuyDichan',
  dichanSell: 'ifSellDichan',
  zhengquanBuy: 'ifBuyZhengquan',
  zhengquanSell: 'ifSellZhengquan',
  jijianBuy: 'ifBuyJijian',
  jijianSell: 'ifSellJijian',
  huanbaoBuy: 'ifBuyHuanbao',
  huanbaoSell: 'ifSellHuanbao',
  qicheBuy: 'ifBuyQiche',
  qicheSell: 'ifSellQiche',
  yiqianBuy: 'ifBuyYiqian',
  yiqianSell: 'ifSellYiqian'
}

const indexInfoUtilJian = {
  Util,
  codeMap,
  fnMap,
  formatData: function (list) {
    let listTemp = []
    for (let i = 0; i < list.length; i++) {
      listTemp.push({
        date: '' + list[i].date,
        ...list[i].kline
      })
    }
    let xData = []
    for (let j = 0; j < 7; j = j + 0.1) {
      xData.push({
        number: j.toFixed(1),
        count: 0,
        countList: [],
        count2: 0,
        countList2: []
      })
    }
    list.forEach((item, index) => {
      let value = Math.abs(numberUtil.countDifferenceRate(item.kline.close, item.kline.preClose))
      let value2 = Math.abs(numberUtil.countDifferenceRate(item.kline.high, item.kline.low))
      for (let i = 0; i < xData.length; i++) {
        if (value >= xData[i].number && xData[i + 1] && value < xData[i + 1].number) {
          xData[i].count++
          xData[i].countList.push(value)
          break
        }
      }
      for (let j = 0; j < xData.length; j++) {
        if (value2 >= xData[j].number && xData[j + 1] && value2 < xData[j + 1].number) {
          xData[j].count2++
          xData[j].countList2.push(value2)
          break
        }
      }
    })
    let all = 0
    let count = 0
    let all2 = 0
    let count2 = 0
    for (let k = 0; k < xData.length; k++) {
      if (xData[k].count >= 5) {
        count = count + xData[k].count
        for (let c = 0; c < xData[k].countList.length; c++) {
          all = all + xData[k].countList[c]
        }
      }
      if (xData[k].count2 >= 5) {
        count2 = count2 + xData[k].count2
        for (let b = 0; b < xData[k].countList2.length; b++) {
          all2 = all2 + xData[k].countList2[b]
        }
      }
    }
    xData.sort((a, b) => {
      return b.count2 - a.count2
    })
    let a = (all2 / count2) / 2
    let c = all / count
    let threshold = numberUtil.keepTwoDecimals((a + c) / 2)
    return { list: listTemp, threshold: threshold, rate: c, wave: a }
  }
}
module.exports = indexInfoUtilJian
