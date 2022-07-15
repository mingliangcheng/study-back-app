const { User } = require('../db/model/user')
const { ErrorModel, SuccessModel } = require('../model/ResModel.js')
const { getUserInfo, createUser, getVideoInfo, createVideo, getVideoSortBySortName, createVideoSort, selectVideoBySortId, updatePassword, updateUserInfo } = require('../services/user')
const { doCrypto } = require('../utils/crypto')
const { PRIVATE_KEYS } = require('../conf/KEYS')
const jwt = require('jsonwebtoken')
class UserController {
  /**
   * @description 判断用户名是否存在
   * @param {string} userName 
   */
  async isExist (userName) {
    const data = await getUserInfo(userName)
  }
  /**
   * 注册用户
   * @param {string} userName 
   * @param {string} password 
   * @param {string} nickName 
   * @param {number} age 
   * @returns 
   */
  async registerUser ({ userName, password, nickName, age }) {
    const user = await getUserInfo(userName)
    if (user) {
      return new ErrorModel({
        code: 1001,
        message: '用户已存在'
      })
    }
    try {
      await createUser({
        userName,
        password: doCrypto(password),
        nickName,
        age
      })
      return new SuccessModel({
        message: '注册成功'
      })
    } catch (error) {
      return new ErrorModel({
        code: 1002,
        message: '注册失败'
      })
    }
  }

  /**
   * @description 上传视频
   * @param {string} title 
   * @param {string} url 
   * @param {string} cover_img 
   * @param {number} uploadId 
   * @param {number} sortId 
   * @returns 
   */
  async uploadVideo ({ title, url, cover_img, uploadId, sortId }) {
    const result = await getVideoInfo(title)
    if (result) {
      return new ErrorModel({
        code: 1003,
        message: '视频标题已存在'
      })
    }
    try {
      await createVideo({
        title,
        url,
        cover_img,
        uploadId,
        sortId
      })
      return new SuccessModel({
        message: '上传成功'
      })
    } catch (error) {
      return new ErrorModel({
        code: 1004,
        message: error
      })
    }
  }

  /**
   * @description 根据视频分类名称新增分类
   * @param {string} sortName 
   * @returns 
   */
  async addVideoSort (sortName) {
    const result = await getVideoSortBySortName(sortName)
    if (result) {
      return new ErrorModel({
        code: 1005,
        message: '视频分类名称已存在'
      })
    }
    try {
      await createVideoSort(sortName)
      return new SuccessModel({
        message: '新增成功'
      })
    } catch (error) {
      return new ErrorModel({
        code: 1006,
        message: error
      })
    }
  }

  /**
   * @description 查询视频
   * @param {number} pageNum 
   * @param {number} pageSize 
   * @param {number} sortId 
   * @param {number} uploadId 
   * @returns 
   */
  async getVideoInfoBySortId ({ pageNum = 1, pageSize = 10, sortId, uploadId }) {
    const result = await selectVideoBySortId({
      pageNum,
      pageSize,
      sortId,
      uploadId
    })
    return new SuccessModel(result)
  }

  /**
   * @description 登录
   * @param {string} userName 用户名
   * @param {string} password 密码
   * @returns 
   */
  async login (userName, password) {
    if (!userName || !password) {
      return new ErrorModel({
        code: 1007,
        message: '缺少用户名或者密码'
      })
    }
    const user = await getUserInfo(userName)
    if (!user) {
      return new ErrorModel({
        code: 1008,
        message: '用户不存在'
      })
    }
    try {
      const result = await getUserInfo(userName, doCrypto(password))
      if (!result) {
        return new ErrorModel({
          code: 1009,
          message: '用户名或密码不正确'
        })
      }
      const token = jwt.sign({ userName, password }, PRIVATE_KEYS, {
        expiresIn: 60 * 60 * 24
      })
      return new SuccessModel({
        token,
        message: '登录成功',
        data: result
      })
    } catch (error) {
      return new ErrorModel({
        code: 1010,
        message: '登录失败'
      })
    }
  }

  /**
   * @description 修改密码
   * @param {string} oldPassword 旧密码
   * @param {string} newPassword 新密码
   * @param {string} userName 用户名
   * @returns 
   */
  async modifyPassword ({ oldPassword, newPassword, userName }) {
    const user = await getUserInfo(userName)
    if (!user) {
      return new ErrorModel({
        code: 1008,
        message: '用户不存在'
      })
    }
    try {
      const result = await getUserInfo(userName, doCrypto(oldPassword))
      if (!result) {
        return new ErrorModel({
          code: 1009,
          message: '用户名或密码不正确'
        })
      }
      const value = await updatePassword(userName, doCrypto(newPassword))
      if (value) {
        return new SuccessModel({
          message: '修改密码成功'
        })
      }
    } catch (error) {

    }
  }

  async modifyUserInfo ({ userName, age, nickName, hobby }) {
    if (!userName) {
      return new ErrorModel({
        code: 1012,
        message: '缺少用户名'
      })
    }
    const user = await getUserInfo(userName)
    if (!user) {
      return new ErrorModel({
        code: 1008,
        message: '用户不存在'
      })
    }
    try {
      const result = await updateUserInfo({
        userName, age, nickName, hobby
      })
      if (result) {
        return new SuccessModel({
          message: '修改用户信息成功'
        })
      }
    } catch (error) {
      return new ErrorModel({
        code: 1013,
        message: error
      })
    }
  }
}

module.exports = new UserController()