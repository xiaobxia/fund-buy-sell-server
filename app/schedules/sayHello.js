const schedule = require('node-schedule')
const reqlib = require('app-root-path').require
const config = reqlib('/config/index')
const scheduleService = require('../services/schedule')
const sendMail = require('../common/email')
const emailUtil = require('../util/emailUntil')
/**
 * cron风格的
 *    *    *    *    *    *
 ┬    ┬    ┬    ┬    ┬    ┬
 │    │    │    │    │    |
 │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
 │    │    │    │    └───── month (1 - 12)
 │    │    │    └────────── day of month (1 - 31)
 │    │    └─────────────── hour (0 - 23)
 │    └──────────────────── minute (0 - 59)
 └───────────────────────── second (0 - 59, OPTIONAL)
 */
let rule = new schedule.RecurrenceRule()

// 工作日，打招呼
rule.dayOfWeek = [new schedule.Range(1, 5)]
rule.hour = [7]
rule.minute = 0

function sayHello () {
  scheduleService.getSchedule('sayHello').then((data) => {
    if (data.open === 'open') {
      sendMail(emailUtil.sayHello({
        userEmail: config.email.adminAccount.user
      }))
    }
  })
}

const job = schedule.scheduleJob(rule, sayHello)

module.exports = job
