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
router.get('/auth/checkLogin', controllers.authController.checkLogin)
// 退出登录
router.get('/auth/logout', controllers.authController.logout)
// 退出登录
router.post('/auth/sendRegisterEmail', controllers.authController.sendRegisterEmail)

/**
 * 用户模块
 */
// 修改用户密码
router.post('/user/newPassword', controllers.userController.newPassword)

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

module.exports = router
