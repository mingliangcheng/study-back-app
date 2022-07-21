const path = require('path')
const fse = require('fs-extra')
const send = require('koa-send')
const DIST_PATH = path.join(__dirname, '..', '..', 'uploadFiles')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const MAX_SIZE = 10 * 1024 * 1024
// 判断是否需要创建目录
fse.pathExists(DIST_PATH).then(exist => {
  if (!exist) {
    fse.ensureDir(DIST_PATH)
  }
})
/**
 * @description 上传单个文件
 * @param {string} name 文件名 
 * @param {strign} filePath 文件路径
 * @param {string} type 文件类型
 * @param {number} size 文件大小
 * @returns 
 */
async function saveFile ({ name, filePath, type, size }) {
  if (size > MAX_SIZE) {
    return new ErrorModel({
      code: 4001,
      message: '文件过大'
    })
  }
  const fileName = Date.now() + '.' + name
  const dist_file_path = path.join(DIST_PATH, fileName)
  await fse.move(filePath, dist_file_path)
  return new SuccessModel({
    url: fileName
  })
}

/**
 * @description 文件下载
 * @param {object} ctx 
 * @param {string} name 文件名
 */
async function download (ctx, name) {
  const path = `/uploadFiles/${name}`
  ctx.attachment(path)
  await send(ctx, path)
}

module.exports = {
  saveFile,
  download
}