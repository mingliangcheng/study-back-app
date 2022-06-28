const Sequelize = require('sequelize')
const { MY_SQL_CONF } = require('../conf/my_sql_conf')
const { database, user, password, port, host } = MY_SQL_CONF
const seq = new Sequelize(database, user, password, {
  host,
  dialect: 'mysql'
})

// 测试连接
seq.authenticate().then(() => {
  console.log('连接成功');
}).catch(e => {
  console.log(e);
})
// export default seq