const proxys = require('../app/proxy/index')

proxys.UserDay.newAndSave({
  detail: {
    today_register_user: 1,
    today_query_user: 0
  },
  // 日期
  date: '2019-04-30'
}).then((doc) => {
  console.log(doc)
})

proxys.UserDay.newAndSave({
  detail: {
    today_register_user: 0,
    today_query_user: 0
  },
  // 日期
  date: '2019-05-01'
}).then((doc) => {
  console.log(doc)
})

proxys.UserDay.newAndSave({
  detail: {
    today_register_user: 1,
    today_query_user: 0
  },
  // 日期
  date: '2019-05-02'
}).then((doc) => {
  console.log(doc)
})

proxys.UserDay.newAndSave({
  detail: {
    today_register_user: 0,
    today_query_user: 0
  },
  // 日期
  date: '2019-05-03'
}).then((doc) => {
  console.log(doc)
})

proxys.UserDay.newAndSave({
  detail: {
    today_register_user: 1,
    today_query_user: 0
  },
  // 日期
  date: '2019-05-04'
}).then((doc) => {
  console.log(doc)
})

proxys.UserDay.newAndSave({
  detail: {
    today_register_user: 0,
    today_query_user: 0
  },
  // 日期
  date: '2019-05-05'
}).then((doc) => {
  console.log(doc)
})

proxys.UserDay.newAndSave({
  detail: {
    today_register_user: 0,
    today_query_user: 0
  },
  // 日期
  date: '2019-05-06'
}).then((doc) => {
  console.log(doc)
})

proxys.UserDay.newAndSave({
  detail: {
    today_register_user: 2,
    today_query_user: 0
  },
  // 日期
  date: '2019-05-07'
}).then((doc) => {
  console.log(doc)
})

proxys.UserDay.newAndSave({
  detail: {
    today_register_user: 10,
    today_query_user: 0
  },
  // 日期
  date: '2019-05-08'
}).then((doc) => {
  console.log(doc)
})

proxys.UserDay.newAndSave({
  detail: {
    today_register_user: 7,
    today_query_user: 0
  },
  // 日期
  date: '2019-05-09'
}).then((doc) => {
  console.log(doc)
})

proxys.UserDay.newAndSave({
  detail: {
    today_register_user: 7,
    today_query_user: 0
  },
  // 日期
  date: '2019-05-10'
}).then((doc) => {
  console.log(doc)
})
