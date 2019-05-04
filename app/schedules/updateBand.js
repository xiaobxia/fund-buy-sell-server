const schedule = require('node-schedule')
const reqlib = require('app-root-path').require
const requestLocal = reqlib('/app/util/requestLocal')
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

// 工作日定时更新估值
rule.dayOfWeek = [new schedule.Range(1, 5)]
rule.hour = [9, 10, 11, 13, 14, 15]
let minute = []
for (let k = 0; k < 60; k += 1) {
  minute.push(k)
}
rule.minute = minute

// 更新波段策略
function updateBand () {
  return requestLocal.get('schedule/updateBand')
}

const job = schedule.scheduleJob(rule, updateBand)

module.exports = job
