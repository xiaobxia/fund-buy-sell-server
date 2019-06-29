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
  ctx.body = 'ok'
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

/**
 * 客户端登录退出模块
 */
router.post('/auth/customerRegister', controllers.authController.customerRegister)
router.post('/auth/customerLogin', controllers.authController.customerLogin)
router.get('/auth/checkCustomer', controllers.authController.checkCustomer)
router.post('/auth/resetPassword', controllers.authController.resetPassword)
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

/**
 * 后台管理，用户模块
 */
router.get('/admin/getAdminUsers', controllers.userController.getAdminUsers)
router.post('/admin/addAdminUser', controllers.userController.addAdminUser)
router.post('/admin/deleteAdminUser', controllers.userController.deleteAdminUser)
router.get('/admin/getCustomers', controllers.userController.getCustomers)
router.get('/admin/getCustomer', controllers.userController.getCustomer)
router.post('/admin/addCustomer', controllers.userController.addCustomer)
router.post('/admin/updateCustomer', controllers.userController.updateCustomer)
router.post('/admin/updateAllContent', controllers.contentController.updateAllContent)
router.get('/admin/getAllContent', controllers.contentController.getAllContent)
router.post('/admin/giveGiftCanUseDay', controllers.userController.giveGiftCanUseDay)
router.post('/admin/giveVacationCanUseDay', controllers.userController.giveVacationCanUseDay)
router.get('/admin/getUserStatistics', controllers.statisticsController.getUserStatistics)
router.get('/admin/getUserDay', controllers.statisticsController.getUserDay)
router.post('/admin/deleteCustomer', controllers.userController.deleteCustomer)
router.get('/admin/getIndexValuation', controllers.contentController.getIndexValuation)
router.post('/admin/updateIndexValuation', controllers.contentController.updateIndexValuation)
/**
 * 客户端模块
 */
router.get('/customerCommon/getCustomerByName', controllers.customerController.getCustomerByName)
router.get('/customerCommon/getBand', controllers.operationController.getBand)
router.get('/customerCommon/addTodayQuery', controllers.customerController.addTodayQuery)
router.get('/customerCommon/getBandContent', controllers.contentController.getBandContent)
router.get('/customerCommon/getIfWarnHighBand', controllers.contentController.getIfWarnHighBand)
// 无需登录模块
router.get('/customerCommon/getIndexValuation', controllers.operationController.getIndexValuation)
router.get('/customerCommon/getFixedInvestment', controllers.operationController.getFixedInvestment)
router.get('/customerCommon/getFixedInvestmentContent', controllers.contentController.getFixedInvestmentContent)
router.get('/customerCommon/getTodayRank', controllers.operationController.getTodayRank)
router.get('/customerCommon/getMonthRank', controllers.operationController.getMonthRank)
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
 * 其他定时任务
 */

router.get('/schedule/initMarketOpening', controllers.scheduleController.initMarketOpening)
router.get('/schedule/verifyMarketOpening', controllers.scheduleController.verifyMarketOpening)
router.get('/schedule/openWork', controllers.scheduleController.openWork)
router.get('/schedule/updateFixedInvestment', controllers.scheduleController.updateFixedInvestment)
router.get('/schedule/updateBand', controllers.scheduleController.updateBand)
router.get('/schedule/updateMonthRate', controllers.scheduleController.updateMonthRate)
router.get('/schedule/updateCustomerTodayHistory', controllers.scheduleController.updateCustomerTodayHistory)
router.get('/schedule/updateCustomerCanUseDay', controllers.scheduleController.updateCustomerCanUseDay)
router.get('/schedule/clearToday', controllers.scheduleController.clearToday)
router.get('/schedule/giveGiftCanUseDay', controllers.userController.giveGiftCanUseDay)
// 送礼的定时任务
router.post('/schedule/giveGiftCanUseDay', controllers.userController.giveGiftCanUseDay)
router.post('/schedule/giveVacationCanUseDay', controllers.userController.giveVacationCanUseDay)

router.get('/qiniu/getUploadToken', controllers.qiniuController.getUploadToken)

// 广告
router.get('/advertisement/getAdvertisements', controllers.advertisementController.getAdvertisements)
router.post('/advertisement/addAdvertisement', controllers.advertisementController.addAdvertisement)
router.post('/advertisement/updateStatus', controllers.advertisementController.updateStatus)
router.post('/advertisement/deleteAdvertisement', controllers.advertisementController.deleteAdvertisement)
router.post('/advertisement/updateAdvertisement', controllers.advertisementController.updateAdvertisement)
router.get('/customerCommon/getAdvertisements', controllers.advertisementController.getAdvertisements)
/**
 * 数据
 */
router.get('/webData/getStockRate', controllers.webDataController.getStockRate)
router.get('/webData/getTradingDays', controllers.webDataController.getTradingDays)
router.get('/webData/getLastTradingDay', controllers.webDataController.getLastTradingDay)
router.get('/webData/getStockTodayTenxun', controllers.webDataController.getStockTodayTenxun)
router.get('/webData/getStockAllTenxun', controllers.webDataController.getStockAllTenxun)
router.get('/webData/getStockTodayDongfang', controllers.webDataController.getStockTodayDongfang)
router.get('/webData/getStockAllDongfang', controllers.webDataController.getStockAllDongfang)
router.get('/webData/getStockTodayXueqiu', controllers.webDataController.getStockTodayXueqiu)
router.get('/webData/getStockAllXueqiu', controllers.webDataController.getStockAllXueqiu)

/**
 * 测试
 */
router.get('/test/testEmail', controllers.testController.testEmail)
router.get('/test/testResponse', controllers.testController.testResponse)
module.exports = router
