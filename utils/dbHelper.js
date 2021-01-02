const Redis = require('ioredis')
const { CACHE }  = require('../config/config')

/* ////////////// Redis ////////////// */

const redis = new Redis({
  host: CACHE.host,
  port: CACHE.port
})

module.exports = {
  redis
}
