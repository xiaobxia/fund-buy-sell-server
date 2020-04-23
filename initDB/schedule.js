const proxys = require('../app/proxy/index')

proxys.Schedule.newAndSave({
  'name': 'sayHello',
  'describe': 'sayHello',
  'type': 'schedule',
  'open': 'close'
}).then((doc) => {
  console.log(doc)
})
