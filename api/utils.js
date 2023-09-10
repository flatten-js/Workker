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

module.exports = { 
  router_handler, 
  sleep, 
  retry, 
  hash_password
}