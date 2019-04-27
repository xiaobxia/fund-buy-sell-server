function getIndex (target, filterModel) {
  for (let i = 0; i < target.length; i++) {
    const item = target[i]
    let same = true
    for (let key in filterModel) {
      if (filterModel[key] !== item[key]) {
        same = false
        break
      }
    }
    if (same) {
      return i
    }
  }
}

exports.findIndex = function (target, filterModel) {
  return getIndex(target, filterModel)
}

exports.findOne = function (target, filterModel) {
  return target[getIndex(target, filterModel)]
}
