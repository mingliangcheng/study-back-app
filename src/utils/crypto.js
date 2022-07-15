const crypto = require('crypto')
const SECRET_KEY = 'jacak232!!'
function doCrypto (str) {
  const hash = crypto.createHash('md5')
    .update(`password${str}&key=${SECRET_KEY}`)
    .digest('hex');
  return hash
}

module.exports = {
  doCrypto
}