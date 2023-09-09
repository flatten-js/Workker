const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sequelize = require('sequelize')

const { JWT_SECRET, TOKEN_COOKIE_NAME } = require('##/config.js')
const { router_handler, hash_password } = require('##/utils.js')
const Mailer = require('###/mailer')
const { User } = require('###/models')
const { authenticate } = require('##/middlewares/auth.js')
const { APP_URL } = require('../config')

router.get('/authenticate', authenticate, (req, res) => {
  res.json({})
})

function access_token(user_id) {
  const token = jwt.sign({ user_id }, JWT_SECRET, { expiresIn: '1h' })
  const options = { httpOnly: true, secure: true, sameSite: true }
  return [token, options]
}

function activate_token(user_id) {
  const token = jwt.sign({ user_id }, JWT_SECRET, { expiresIn: 60 * 5 })
  return [token]
}

router.post('/signin', router_handler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })
  if (!user) throw new Error('No users have been registered yet.')

  const compared = await bcrypt.compare(password, user.password)
  if (!compared) throw new Error('Password did not match.')

  if (user.verified_at) {
    const token = access_token(user.id)
    res.cookie(TOKEN_COOKIE_NAME, ...token)
  } else {
    const token = activate_token(user.id)
    await Mailer.activate_account(email, ...token)
  }
  
  res.json({ verified: !!user.verified_at })
}))

router.post('/signup', router_handler(async (req, res) => {
  const { email, password } = req.body

  let user = await User.findOne({ where: { email } })
  if (user) throw new Error('That email address is in use')

  user = await User.create({ email, password: await hash_password(password) })

  const token = activate_token(user.id)
  await Mailer.activate_account(email, ...token)

  res.json({})
}))

router.get('/activate/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, JWT_SECRET)

    const user = await User.findOne({ where: { id: decoded.user_id } })
    if (!user) throw new Error('No users have been registered yet.')

    if (!user.verified_at) {
      user.verified_at = sequelize.fn('NOW')
      await user.save()

      const token = access_token(user.id)
      res.cookie(TOKEN_COOKIE_NAME, ...token)
    }
  
    res.redirect(APP_URL)
  } catch (e) {
    console.error(e)
    res.redirect(APP_URL)
  }
})

router.post('/signout', router_handler((req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME)
  res.json({})
}))

module.exports = router