const { REDIS_CONF } = require('../conf/redis_conf')
const redis = require('redis')
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
  console.log(err);
})

class RedisCache {
  set (key, val, timeout = 60 * 60) {
    if (typeof val == 'object') {
      val = JSON.stringify(val)
    }
    redisClient.set(key, val)
    redisClient.expire(key, timeout)
  }

  get (key) {
    return new Promise((resolve, reject) => {
      redisClient.get(key, (err, val) => {
        if (err) {
          reject(err)
          return
        }
        try {
          resolve(JSON.parse(val))
        } catch (error) {
          resolve(val)
        }
      })
    })
  }
}

module.exports = new RedisCache()


