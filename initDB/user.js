const proxys = require('../app/proxy/index')

proxys.User.newAndSave({
  name: 'xiaobxia',
  email: 'xiaobxia',
  password: 'xiaobxia',
  roles: ['admin'],
  email_active: true,
  vip_days: 1000
}).then((doc) => {
  console.log(doc)
})

proxys.User.newAndSave({
  name: 'ztt',
  email: 'ztt',
  password: 'ztt',
  roles: ['admin'],
  email_active: true,
  vip_days: 1000
}).then((doc) => {
  console.log(doc)
})
