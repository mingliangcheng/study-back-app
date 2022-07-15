const seq = require('../seq')
const { User } = require('./user')
const { Video } = require('./video')
const { SortVideo } = require('./sortVideo')
User.hasMany(Video, {
  foreignKey: 'uploadId',
  targetKey: 'userId'
})

Video.belongsTo(User, {
  foreignKey: 'uploadId',
  targetKey: 'userId'
})
SortVideo.hasMany(Video, {
  foreignKey: 'sortId'
})
Video.belongsTo(SortVideo, {
  foreignKey: 'sortId'
})
seq.sync().then(() => {
  console.log('同步成功');
})