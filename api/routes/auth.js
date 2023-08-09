const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sequelize = require('sequelize')

const { JWT_SECRET, TOKEN_COOKIE_NAME } = require('##/config.js')
const { router_handler, hash_password, to_message } = require('##/utils.js')
const { transport } = require('###/mailer')
const { account_activation } = require('##/mailer/template.js')
const { User } = require('###/models')
const { authenticate } = require('##/middlewares/auth.js')
const { APP_URL } = require('../config')

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

  if (user.verified_at) {
    token_sign(res, user.id)
  } else {
    const token = jwt.sign({ user_id: user.id }, JWT_SECRET, { expiresIn: '1h' })
    const options = account_activation(email, token)
    await transport.sendMail(options)
  }
  
  res.json({ verified: !!user.verified_at })
}))

router.post('/signup', router_handler(async (req, res) => {
  const { email, password } = req.body

  let user = await User.findOne({ where: { email } })
  if (user) throw new Error('That email address is in use')

  user = await User.create({ email, password: await hash_password(password) })

  const token = jwt.sign({ user_id: user.id }, JWT_SECRET, { expiresIn: '1h' })
  const options = account_activation(email, token)
  await transport.sendMail(options)

  res.json({})
}))

router.get('/email/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, JWT_SECRET)

    const user = await User.findOne({ where: { id: decoded.user_id } })
    if (!user) throw new Error('No users have been registered yet.')
  
    user.verified_at = sequelize.fn('NOW')
    await user.save()
  
    token_sign(res, user.id)
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