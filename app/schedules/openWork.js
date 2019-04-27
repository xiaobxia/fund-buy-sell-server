const schedule = require('node-schedule')
const reqlib = require('app-root-path').require
const requestLocal = reqlib('/app/util/requestLocal')
const scheduleService = require('../services/schedule')
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
/**
 * 每天的9点55分
 */
rule.hour = 9
rule.minute = 55

function openWork () {
  scheduleService.getSchedule('openWork').then((data) => {
    if (data && data.open === 'open') {
      requestLocal.get('schedule/openWork')
    }
  })
}

const job = schedule.scheduleJob(rule, openWork)

module.exports = job
