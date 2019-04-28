const proxys = require('../app/proxy/index')

// 定投态度
// proxys.Dictionary.newAndSave({
//   'key': 'fixedInvestmentContent',
//   'value': ''
// }).then((doc) => {
//   console.log(doc)
// })
// 仓位
// proxys.Dictionary.newAndSave({
//   'key': 'positionContent',
//   'value': ''
// }).then((doc) => {
//   console.log(doc)
// })
proxys.Dictionary.newAndSave({
  'key': 'marketWarn',
  'value': ''
}).then((doc) => {
  console.log(doc)
})
