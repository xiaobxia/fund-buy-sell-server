const Proxy = require('../proxy')
const moment = require('moment')

const UserProxy = Proxy.User
const UserDayProxy = Proxy.UserDay

exports.getUserStatistics = async function (data) {
  const fetchData = await Promise.all([
    // 今天注册的用户统计
    UserProxy.count({
      roles: {
        $in: ['user']
      },
      create_at: {
        $gte: moment().format('YYYY-MM-DD')
      }
    }),
    UserProxy.count({
      roles: {
        $in: ['user']
      },
      today_query: {
        $gt: 0
      }
    }),
    UserProxy.count({
      roles: {
        $in: ['user']
      }
    }),
    UserProxy.count({
      roles: {
        $in: ['user']
      },
      if_test: true
    }),
    UserProxy.count({
      roles: {
        $in: ['user']
      },
      can_use_day: {
        $gt: 0
      }
    })
  ])
  return {
    today_register_user: fetchData[0],
    today_query_user: fetchData[1],
    history_register_user: fetchData[2],
    has_test_user: fetchData[3],
    can_use_user: fetchData[4]
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
