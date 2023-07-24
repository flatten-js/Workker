const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { JWT_SECRET, TOKEN_COOKIE_NAME } = require('##/config.js')
const { router_handler, hash_password } = require('##/utils.js')
const { User } = require('###/models')
const { authenticate } = require('../middlewares/auth')

router.get('/authenticate', authenticate, (req, res) => {
  res.json({})
})

function token_sign(res, user_id) {
  const token = jwt.sign({ user_id }, JWT_SECRET, { expiresIn: '1h' })
  res.cookie(TOKEN_COOKIE_NAME, token, { httpOnly: true, secure: true, sameSite: true })
}

router.post('/signin', router_handler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })
  if (!user) throw new Error('No users have been registered yet.')

  const compared = await bcrypt.compare(password, user.password)
  if (!compared) throw new Error('Password did not match.')
  
  token_sign(res, user.id)
  res.json({})
}))

router.post('/signup', router_handler(async (req, res) => {
  const { email, password } = req.body

  let user = await User.findOne({ where: { email } })
  if (user) throw new Error('That email address is in use')

  user = await User.create({ email, password: await hash_password(password) })

  token_sign(res, user.id)
  res.json({})
}))

router.post('/signout', router_handler((req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME)
  res.json({})
}))

module.exports = router