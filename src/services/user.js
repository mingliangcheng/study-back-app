const { User } = require('../db/model/user')
const { Video } = require('../db/model/video')
const { SortVideo } = require('../db/model/sortVideo')
class UserService {
  /**
   * @description 根据用户名查询用户信息
   * @param {string} userName 
   * @returns 
   */
  async getUserInfo (userName, password) {
    const whereOpt = {
      userName
    }
    if (password) {
      Object.assign(whereOpt, {
        password
      })
    }
    const result = await User.findOne({
      attributes: ['userName', 'userId', 'nickName', 'age', 'hobby'],
      where: whereOpt
    })
    if (result == null) {
      return null
    }
    return result.dataValues
  }
  /**
   * @description 注册用户
   * @param {string} userName
   * @param {string} password
   * @param {string} nickName
   * @param {number} age
   * @returns 
   */
  async createUser ({ userName, password, nickName, age }) {
    if (!nickName) {
      nickName = userName
    }
    const result = await User.create({
      userName,
      password,
      nickName,
      age
    })
    return result.dataValues
  }

  /**
   * @description 根据视频标题查询视频信息
   * @param {string} title 
   * @returns 
   */
  async getVideoInfo (title) {
    const result = await Video.findOne({
      where: {
        title
      }
    })
    if (result == null) {
      return result
    }
    return result.dataValues
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
  async createVideo ({ title, url, cover_img, uploadId, sortId }) {
    const data = await Video.create({
      title,
      url,
      cover_img,
      uploadId,
      sortId
    })
    return data.dataValues
  }

  /**
   * @description 根据视频分类名称查询视频分类信息
   * @param {string} sortName 
   * @returns 
   */
  async getVideoSortBySortName (sortName) {
    const result = await SortVideo.findOne({
      where: {
        sortName
      }
    })
    if (result == null) {
      return result
    }
    return result.dataValues
  }

  /**
   * @description 新增视频分类
   * @param {string} sortName 
   * @returns 
   */
  async createVideoSort (sortName) {
    const result = SortVideo.create({
      sortName
    })
    return result.dataValues
  }

  /**
   * @description 查询视频信息
   * @param {number} sortId 
   * @param {number} pageNum 
   * @param {number} pageSize 
   * @param {number} uploadId 
   */
  async selectVideoBySortId ({ sortId, pageNum, pageSize, uploadId }) {
    const opt = {}
    if (sortId) {
      Object.assign(opt, {
        sortId
      })
    }
    if (uploadId) {
      Object.assign(opt, {
        uploadId
      })
    }
    const result = await Video.findAndCountAll({
      attributes: ['videoId', 'title', 'url', 'cover_img', 'uploadId', 'sortId', 'likeNum'],
      order: [
        ['videoId', 'asc']
      ],
      limit: Number(pageSize),
      offset: (Number(pageNum) - 1) * pageSize,
      where: opt,
    })
    let video = result.rows.map(video => video.dataValues)
    const count = result.count
    return {
      count,
      data: video
    }
  }

  /**
   * @description 修改密码
   * @param {string} oldPassword 旧密码
   * @param {string} newPassword 新密码
   * @param {string} userName 用户名
   * @returns 
   */
  async updatePassword (userName, newPassword) {
    const result = await User.update({
      password: newPassword
    }, {
      where: {
        userName
      }
    })
    return result
  }

  /**
   * @description 更新用户信息
   * @param {string} userName 用户名
   * @param {string} nickName 昵称
   * @param {number} age 年龄
   * @param {string} hobby 爱好
   * @returns 
   */
  async updateUserInfo ({ userName, nickName, age, hobby }) {
    const result = await User.update({
      userName,
      age,
      hobby,
      nickName
    }, {
      where: {
        userName
      }
    })
    return result
  }
}
module.exports = new UserService()