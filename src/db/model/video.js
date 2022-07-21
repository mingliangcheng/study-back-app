/**
 * @description 视频表
 */
const seq = require('../seq')
const Sequelize = require('sequelize')
const { SortVideo } = require('./sortVideo')
const Video = seq.define('video', {
  videoId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    comments: '视频标题'
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    comments: '视频地址'
  },
  cover_img: {
    type: Sequelize.STRING,
    allowNull: true,
    comments: '视频封面'
  },
  uploadId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comments: '上传用户id'
  },
  sortId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comments: '分类id'
  },
  likeNum: {
    type: Sequelize.INTEGER,
    allowNull: true,
    comments: '点赞数'
  }
})
SortVideo.hasMany(Video, {
  foreignKey: 'sortId',
  targetKey: 'id'
})
Video.belongsTo(SortVideo, {
  foreignKey: 'sortId',
  targetKey: 'id'
})
module.exports = {
  Video
}