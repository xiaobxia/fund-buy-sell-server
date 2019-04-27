const numberUtil = {
  countRate: function (numerator, denominator) {
    denominator = denominator || 1
    return Math.round(10000 * (numerator / denominator)) / 100
  },
  countDifferenceRate: function (numerator, denominator) {
    denominator = denominator || 1
    numerator = numerator || 1
    return Math.round(10000 * ((numerator - denominator) / denominator)) / 100
  },
  keepTwoDecimals: function (number) {
    return Math.round(100 * number) / 100
  },
  keepFourDecimals: function (number) {
    return Math.round(10000 * number) / 10000
  },
  ifAround: function (number, target) {
    const step = 100
    return (number >= (target - step)) && (number <= (target + step))
  }
}

module.exports = numberUtil
