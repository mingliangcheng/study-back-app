/**
 * @description 用户表
 */
const seq = require('../seq')
const Sequelize = require('sequelize')
const { Video } = require('./video')

const User = seq.define('user', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  nickName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  hobby: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

User.hasMany(Video, {
  foreignKey: 'uploadId',
  targetKey: 'userId'
})

Video.belongsTo(User, {
  foreignKey: 'uploadId',
  targetKey: 'userId'
})

module.exports = {
  User
}