const router = require('koa-router')()
const { saveFile, download } = require('../controller/upload')

router.prefix('/users')

router.post('/uploadAvatar', async (ctx, next) => {
  const file = ctx.request.files.avatar
  const { name, size, path, type } = file
  ctx.body = await saveFile({
    filePath: path,
    name,
    size,
    type
  })
})

router.get('/download', async (ctx, next) => {
  const { fileName } = ctx.query
  await download(ctx, fileName)
})

module.exports = router
