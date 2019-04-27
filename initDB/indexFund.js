const indexList = require('../app/const/indexList')
const proxys = require('../app/proxy/index')

for (let i = 0; i < indexList.list.length; i++) {
  const index = indexList.list[i]
  proxys.IndexFund.newAndSave({
    code: index.code,
    name: index.name,
    type: index.type,
    fundCode: index.fundCode,
    fundName: index.fundName,
    sortIndex: i
  }).then((doc) => {
    console.log(doc)
  })
}
