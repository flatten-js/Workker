const bcrypt = require('bcrypt')

const { PASSWORD_SALT_ROUNDS } = require('##/config.js')

function router_handler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next)
    } catch (e) {
      next(e)
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function retry(n, ms, process_cb, validate_cb) {
  for (let i = 0; i < n; i++) {
    try {
      const result = await process_cb()
      if (await validate_cb(result)) return result
    } catch (e) {
      console.warning(e)
    }
    
    await sleep(ms)
  }
}

async function hash_password(password, salt = PASSWORD_SALT_ROUNDS) {
  salt = await bcrypt.genSalt(salt)
  return await bcrypt.hash(password, salt)
}

function hybeny_distance(lat1, lng1, lat2, lng2) {
  const rad = deg => deg * Math.PI / 180

  lat1 = rad(lat1)
  lng1 = rad(lng1)
  lat2 = rad(lat2)
  lng2 = rad(lng2)

  var latDiff = lat1 - lat2
  var lngDiff = lng1 - lng2
  var latAvg = (lat1 + lat2) / 2.0
  var a = 6378137.0
  var b = 6356752.314140356
  var e2 = 0.00669438002301188
  var a1e2 = 6335439.32708317

  var sinLat = Math.sin(latAvg)
  var W2 = 1.0 - e2 * (sinLat * sinLat)

  var M = a1e2 / (Math.sqrt(W2) * W2)
  var N = a / Math.sqrt(W2)

  t1 = M * latDiff
  t2 = N * Math.cos(latAvg) * lngDiff

  return Math.sqrt((t1 * t1) + (t2 * t2))
}

module.exports = { 
  router_handler, 
  sleep, 
  retry, 
  hash_password,
  hybeny_distance 
}