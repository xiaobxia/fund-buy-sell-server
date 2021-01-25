const Router = require('koa-router')
const multer = require('koa-multer')
const reqlib = require('app-root-path').require
const config = reqlib('/config/index')
const controllers = require('../controllers')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ storage: storage })

const projectName = config.project.projectName
if (!projectName) {
  console.error('projectName is required')
  process.exit()
}
const router = new Router({
  prefix: `/${projectName}`
})

/**
 * 端口测试
 */
router.get('/', async function (ctx) {
  ctx.body = `ok ${projectName}`
})

/**
 * 登陆模块
 */
// 注册
router.post('/auth/register', controllers.authController.register)
// 登陆
router.post('/auth/login', controllers.authController.login)
// 检查登陆
router.get('/auth/checkToken', controllers.authController.checkToken)
// 退出登录
router.get('/auth/logout', controllers.authController.logout)
// 发送注册邮件
router.post('/auth/registerWidthEmail', controllers.authController.registerWidthEmail)
// 发送激活邮件
router.post('/auth/sendActiveEmail', controllers.authController.sendActiveEmail)
// 邮箱激活
router.get('/auth/activeRegister', controllers.authController.activeRegister)
// 发送忘记密码邮件
router.post('/auth/sendForgetEmail', controllers.authController.sendForgetEmail)
// 重设密码
router.post('/auth/resetPassword', controllers.authController.resetPassword)

/**
 * 用户模块
 */
// 修改用户密码
router.post('/user/newPassword', controllers.userController.newPassword)
// 分页获取用户
router.get('/user/getRecords', controllers.userController.getRecords)
// 通过邮箱获取用户
router.get('/user/getUserByEmail', controllers.userController.getUserByEmail)
// 通过令牌获取用户
router.get('/user/getUserByToken', controllers.userController.getUserByToken)
// 添加vip时间
router.post('/user/addUserVipDays', controllers.userController.addUserVipDays)

/**
 * 日志模块
 */
router.get('/log/emailSendLogGetRecords', controllers.logController.emailSendLogGetRecords)
router.get('/log/invitationLogGetRecords', controllers.logController.invitationLogGetRecords)
router.get('/log/getInvitationLogByToken', controllers.logController.getInvitationLogByToken)

/**
 * 文件上传模块
 */
router.post('/upload/importNumbers', upload.single('numberFile'), controllers.uploadController.importNumbers)

/**
 * 文件下载模块
 */
router.post('/download/exportNumbers', controllers.exportController.exportNumbers)
router.get('/download/exportXlsx', controllers.exportController.exportXlsx)

/**
 * 定时任务模块
 */
router.post('/schedule/add', controllers.scheduleController.addSchedule)
router.get('/schedule/delete', controllers.scheduleController.deleteSchedule)
router.post('/schedule/update', controllers.scheduleController.updateSchedule)
router.post('/schedule/changeStatus', controllers.scheduleController.changeScheduleStatus)
router.get('/schedule/all', controllers.scheduleController.getSchedules)
router.get('/schedule/one', controllers.scheduleController.getSchedule)

/**
 * 测试
 */
router.get('/test/testEmail', controllers.testController.testEmail)
router.get('/test/testResponse', controllers.testController.testResponse)

/**
 * 信号模块
 */
router.post('/bsSignal/updateSignal', controllers.buySellSignalController.updateSignal)
router.get('/bsSignal/getLastSignal', controllers.buySellSignalController.getLastSignal)
router.get('/bsSignal/getSignalsByDays', controllers.buySellSignalController.getSignalsByDays)
router.get('/bsSignal/getSignalsByStart', controllers.buySellSignalController.getSignalsByStart)

router.post('/riskSignal/updateSignal', controllers.riskController.updateSignal)
router.get('/riskSignal/getLastSignal', controllers.riskController.getLastSignal)
router.get('/riskSignal/getSignalsByDays', controllers.riskController.getSignalsByDays)
router.get('/riskSignal/getSignalsByStart', controllers.riskController.getSignalsByStart)

/**
 * 意见反馈
 */
router.get('/feedback/getRecords', controllers.feedbackController.getRecords)
router.post('/feedback/addFeedback', controllers.feedbackController.addFeedback)

/**
 * 信息流
 */
router.post('/infoFlow/updateInfoFlow', controllers.informationFlowController.updateInfoFlow)
router.post('/infoFlow/addLike', controllers.informationFlowController.addLike)
router.post('/infoFlow/disLike', controllers.informationFlowController.disLike)
router.get('/infoFlow/getUserInfoFlow', controllers.informationFlowController.getUserInfoFlow)
router.get('/infoFlow/getAdminInfoFlow', controllers.informationFlowController.getAdminInfoFlow)
router.post('/infoFlow/deleteRecord', controllers.informationFlowController.deleteRecord)

module.exports = router
