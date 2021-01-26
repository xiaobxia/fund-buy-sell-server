const proxys = require('../app/proxy/index')

proxys.Dictionary.newAndSave({
  // 键
  key: 'gzhToken',
  // 说明
  describe: '公众号token',
  // 归类
  type: '',
  // 值
  value: ''
}).then((doc) => {
  console.log(doc)
})
