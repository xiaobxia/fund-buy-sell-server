const Proxy = require('../proxy')
const moment = require('moment')

const UserProxy = Proxy.User
const UserDayProxy = Proxy.UserDay

exports.getUserStatistics = async function (data) {
  const users = UserProxy.find({
    roles: {
      $in: ['user']
    }
  })
  let todayRegisterUser = 0
  let todayQueryUser = 0
  let hasTestUser = 0
  let canUseUser = 0
  let todayQuery = 0
  for (let i = 0;i<users.length;i++) {
    const user = users[i]
    if (moment(user.create_at).isAfter(moment().format('YYYY-MM-DD') + ' 00:00:00')) {
      todayRegisterUser ++
    }
    if (user.name !== 'wx_4' && user.name !== '17681824125') {
      if (user.today_query > 0) {
        todayQueryUser ++
        todayQuery = todayQuery + user.today_query
      }
      if (user.if_test === true) {
        hasTestUser ++
      }
      if (user.can_use_day > 0) {
        canUseUser ++
      }
    }
  }
  return {
    today_register_user: todayRegisterUser,
    today_query_user: todayQueryUser,
    history_register_user: users.length - 2,
    has_test_user: hasTestUser,
    can_use_user: canUseUser
  }
}

exports.getUserDay = async function (query) {
  const opt = {
    sort: {
      date: 1
    }
  }
  let queryOption = {}
  if (query.startTime) {
    queryOption.date = {
      $gte: query.startTime,
      $lt: query.endTime
    }
  }
  return UserDayProxy.find(queryOption, opt)
}
