const proxys = require('../app/proxy/index')

proxys.User.newAndSave({
  name: 'xiaobxia',
  email: 'xiaobxia',
  password: 'xiaobxia',
  roles: ['admin']
}).then((doc) => {
  console.log(doc)
})

proxys.User.newAndSave({
  name: 'test',
  email: 'test',
  password: 'test',
  roles: ['test']
}).then((doc) => {
  console.log(doc)
})
