/**
 * @description 视频分类表
 */
const seq = require('../seq')
const Sequelize = require('sequelize')
const SortVideo = seq.define('sort_video', {
  sortName: {
    type: Sequelize.STRING,
    allowNull: false,
    comments: '视频分类名称'
  }
})
module.exports = {
  SortVideo
}