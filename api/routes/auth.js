const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _sequelize = require('sequelize')
const crypto = require('crypto')

const { JWT_SECRET, TOKEN_COOKIE_NAME } = require('##/config.js')
const { router_handler, hash_password } = require('##/utils.js')
const Mailer = require('###/mailer')
const { sequelize, User } = require('###/models')
const { set_vcode, get_vcode } = require('##/stores/redis.js')
const { authenticate, unverifiedAuthenticate } = require('##/middlewares/auth.js')

router.get('/authenticate', authenticate, (req, res) => {
  res.json({})
})

function access_token(user_id, verified) {
  const token = jwt.sign({ user_id, verified }, JWT_SECRET, { expiresIn: '1h' })
  const options = { httpOnly: true, secure: true, sameSite: true }
  return [token, options]
}

router.post('/signin', router_handler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })
  if (!user) throw new Error('No users have been registered yet.')

  const compared = await bcrypt.compare(password, user.password)
  if (!compared) throw new Error('Password did not match.')

  const verified = !!user.verified_at

  if (!verified) {
    let code = await get_vcode(user.id)
    if (!code) {
      code = crypto.randomInt(100000, 999999)
      await set_vcode(user.id, code)
      await Mailer.activate_account(email, code)
    }
  }
  
  const token = access_token(user.id, verified)
  res.cookie(TOKEN_COOKIE_NAME, ...token)
  res.json({ verified })
}))

router.post('/signup', router_handler(async (req, res) => {
  const { name, email, password } = req.body

  let user = await User.findOne({ where: { email } })
  if (user) throw new Error('That email address is in use')

  await sequelize.transaction(async transaction => {
    user = await User.create({
      name: 'Developer', 
      email, 
      password: await hash_password(password) 
    }, { transaction })

    const code = crypto.randomInt(100000, 999999)
    await set_vcode(user.id, code)
    await Mailer.activate_account(email, code)
  })

  const token = access_token(user.id, false)
  res.cookie(TOKEN_COOKIE_NAME, ...token)
  res.json({})
}))

router.post('/verify', unverifiedAuthenticate, router_handler(async (req, res) => {
  const { user_id } = req.decoded
  const { code } = req.body
  const vcode = await get_vcode(user_id)

  const user = await User.findOne({ where: { id: user_id } })
  if (!user) throw new Error('No users have been registered yet.')

  if (code == vcode) {
    user.verified_at = _sequelize.fn('NOW')
    await user.save()

    const token = access_token(user.id, true)
    res.cookie(TOKEN_COOKIE_NAME, ...token)
    res.send()
  } else {
    res.status(400).send('Incorrect verification code.')
  }
}))

router.post('/signout', router_handler((req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME)
  res.json({})
}))

module.exports = router