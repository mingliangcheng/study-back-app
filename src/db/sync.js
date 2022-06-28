const seq = require('./seq')
require('./model/index')
seq.sync().then(() => {
  console.log('同步成功');
})