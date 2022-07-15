const router = require('koa-router')()
const { saveFile, download } = require('../controller/upload')
const { registerUser, uploadVideo, addVideoSort, getVideoInfoBySortId, login, modifyPassword, modifyUserInfo } = require('../controller/user')
const sm2 = require('sm-crypto').sm2;
let publicKeyMes, privatekeyMes
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

router.get('/encrypt/getPublicKey', async (ctx, next) => {
  let keypair = sm2.generateKeyPairHex();
  publicKeyMes = keypair.publicKey
  privatekeyMes = keypair.privateKey
  ctx.body = {
    code: 200,
    publicKey: publicKeyMes,
    cryptoToken: '16asdhbasu598dasd'
  }
})

router.get('/encrypt/testGet', (ctx, next) => {
  const { encrypt } = ctx.request.headers
  const params = ctx.query || {}
  const originalData = JSON.stringify({
    code: 200,
    data: params
  })
  // const encryptedData = SM2.encrypt(originalData, encrypt, {
  //   inputEncoding: 'utf8',
  //   outputEncoding: 'base64'
  // })
  const encryptedData = sm2.doEncrypt(originalData, encrypt, 0)
  ctx.body = encryptedData
})

router.post('/encrypt/login', (ctx, next) => {
  // const { data } = ctx.request.body
  const { encrypt } = ctx.request.headers
  // const decryptedData = SM2.decrypt(data, privatekey, {
  //   inputEncoding: 'base64',
  //   outputEncoding: 'utf8'
  // })
  const data = JSON.stringify(
    {
      code: 200,
      data: {
        city: '南京',
        country: 'China',
        base: 'wuxi'
      }
    }
  )
  const decryptedData = sm2.doDecrypt(data, privatekeyMes, 0)
  const encryptedData = sm2.doEncrypt(data, encrypt, 0)
  ctx.body = encryptedData
})

router.get('/normal', async (ctx, next) => {
  ctx.body = {
    code: 200,
    data: '一切ok'
  }
})

router.post('/postNormal', async (ctx, next) => {
  ctx.body = {
    code: 200,
    data: '一切ok'
  }
})

// 注册用户
router.post('/register', async (ctx, next) => {
  const { userName, password, nickName, age } = ctx.request.body
  ctx.body = await registerUser({
    userName,
    password,
    nickName,
    age
  })
})

// 上传视频
router.post('/uploadVideo', async (ctx, next) => {
  const { title, url, cover_img, uploadId, sortId } = ctx.request.body
  ctx.body = await uploadVideo({
    title,
    url,
    cover_img,
    uploadId,
    sortId
  })
})

// 新增视频分类
router.post('/addVideoBySortName', async (ctx, next) => {
  const { sortName } = ctx.request.body
  ctx.body = await addVideoSort(sortName)
})

// 根据分类名称查询视频
router.get('/getVideoBySortId', async (ctx, next) => {
  const { pageNum, pageSize, sortId, uploadId } = ctx.query
  ctx.body = await getVideoInfoBySortId({
    pageNum,
    pageSize,
    sortId,
    uploadId
  })
})

// 登录接口
router.post('/login', async (ctx, next) => {
  const { userName, password } = ctx.request.body
  ctx.body = await login(userName, password)
})

// 修改密码
router.post('/updatePassword', async (ctx, next) => {
  const { oldPassword, newPassword, userName } = ctx.request.body
  ctx.body = await modifyPassword({
    oldPassword, newPassword, userName
  })
})

// 用户更新信息
router.post('/updateUserInfo', async (ctx, next) => {
  const { userName, age, hobby, nickName } = ctx.request.body
  ctx.body = await modifyUserInfo({
    userName,
    nickName,
    age,
    hobby
  })
})

module.exports = router
