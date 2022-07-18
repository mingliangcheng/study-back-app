const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const path = require('path')

const index = require('./src/routes/index')
const users = require('./src/routes/users')
const cors = require('koa2-cors')
const koaJwt = require('koa-jwt')
const { PRIVATE_KEYS } = require('./src/conf/KEYS')
const { accessLogger, logger: log } = require('./src/middlewares/log')

// error handler
onerror(app)

// middlewares
app.use(
  koaBody({
    multipart: true,    //解析多个文件
    formidable: {
      maxFileSize: 100 * 1024 * 1024,    // 设置上传文件大小最大限制，默认2M
      keepExtensions: true, // 保持文件的后缀
    }
  })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/uploadFiles'))
// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(accessLogger());
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
  log.error(err)
});


app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  // 允许接收cookie
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'token', 'privatekey', 'publickey', 'isEncrypt', 'Encrypt'],
}))
// 错误处理
app.use((ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: '无权限'
      };
    } else {
      throw err;
    }
  })
})
app.use(koaJwt({
  secret: PRIVATE_KEYS
}).unless({
  path: [/\/users\/login/, /\/users\/register/]
}))
// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
