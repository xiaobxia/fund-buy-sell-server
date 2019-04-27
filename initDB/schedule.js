const proxys = require('../app/proxy/index')

proxys.Schedule.newAndSave({
  'name': 'openWork',
  'describe': '基金开市准备',
  'type': 'schedule',
  'open': 'close'
}).then((doc) => {
  console.log(doc)
})
