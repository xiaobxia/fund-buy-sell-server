function formatFields (fields, rawData) {
  let data = {}
  for (let i = 0; i < fields.length; i++) {
    const key = fields[i].field
    let alias = fields[i].alias
    let format = fields[i].format
    let value = rawData[key]
    data[alias || key] = format ? format(value) : value
  }
  return data
}

exports.formatFields = formatFields
exports.formatListFields = function (fields, rawList) {
  let data = []
  for (let i = 0; i < rawList.length; i++) {
    data.push(formatFields(fields, rawList[i]))
  }
  return data
}
