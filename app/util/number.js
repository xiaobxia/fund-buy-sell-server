exports.countRate = function (numerator, denominator) {
  denominator = denominator || 1
  return Math.round(10000 * (numerator / denominator)) / 100
}

exports.countDifferenceRate = function (numerator, denominator) {
  denominator = denominator || 1
  return Math.round(10000 * ((numerator - denominator) / denominator)) / 100
}

exports.keepOneDecimal = function (number) {
  return Math.round(10 * number) / 10
}

exports.keepTwoDecimals = function (number) {
  return Math.round(100 * number) / 100
}

exports.toTwoDecimals = function (number) {
  let newNumber = parseFloat(number)
  if (isNaN(newNumber)) {
    newNumber = 0
  }
  return newNumber.toFixed(2)
}

exports.keepFourDecimals = function (number) {
  return Math.round(10000 * number) / 10000
}
