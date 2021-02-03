const Koa = require('koa')
const bluebird = require('bluebird')
const cors = require('koa-cors')
const bodyParser = require('koa-bodyparser')
const ratelimit = require('koa-ratelimit')
const base = require('./app/base')
const checkLogin = require('./app/middlewares/checkLogin')
const error = require('./app/middlewares/error')
const router = require('./app/routes/index')
const config = require('./config/index')

global.Promise = bluebird
const env = process.env.NODE_ENV

const app = new Koa()

// apply rate limit
const db = new Map()

// 加入全局信息
base(app)

// 跨域
app.use(cors({
  methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  credentials: true,
  maxAge: 2592000
}))

// 对ip进行限流
// 10秒内不能超过20次
app.use(ratelimit({
  driver: 'memory',
  db: db,
  duration: 10 * 1000,
  errorMessage: 'Slow',
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  max: 20,
  disableHeader: false,
  whitelist: (ctx) => {
    // some logic that returns a boolean
  },
  blacklist: (ctx) => {
    // some logic that returns a boolean
  }
}))

// 每个next都需要await
// 请求日志
// app.use(requestLog)
// 检查登录中间件
app.use(checkLogin)

// post
app.use(bodyParser())

// 路由，默认拥有404
app.use(router.routes())

// 错误处理
app.on('error', error)

// 监听
const port = config.server.port || 8080

app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
  console.log(`当前环境是:${env || 'dev'}`)
})
