const redis = require('redis')

const { REDIS_URL, REDIS_VCODE_PREFIX } = require('##/config.js')

const client = redis.createClient({ url: REDIS_URL })
client.connect()

function create_key(...keys) {
  return keys.join('_')
}

async function set_vcode(user_id, code) {
  const key = create_key(REDIS_VCODE_PREFIX, user_id)
  await client.set(key, code, { EX: 60 * 10 })
}

async function get_vcode(user_id) {
  const key = create_key(REDIS_VCODE_PREFIX, user_id)
  return await client.get(key)
}

module.exports = { set_vcode, get_vcode }