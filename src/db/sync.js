const seq = require('./seq')
require('./model/index')
seq.sync({ alert: true }).then(() => {
  console.log('同步成功');
})