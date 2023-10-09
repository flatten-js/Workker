const express = require('express')
const router = express.Router()

const { authenticate } = require('##/middlewares/auth.js')

const { sequelize, ShopItem, User } = require('###/models')
const { router_handler } = require('##/utils.js')

router.post('/charge', authenticate, router_handler(async (req, res) => {
  const { user_id } = req.decoded
  const user = await User.findOne({ where: { id: user_id } })
  if (user.charge < 1) {
    throw new Error('Does not meet the quantity redeemable for tickets')
  }

  const ticket = Math.trunc(user.charge)
  await sequelize.transaction(async transaction => {
    user.charge -= ticket
    user.ticket += ticket
    await user.save({ transaction })
  })

  res.json({})
}))

router.get('/items', authenticate, router_handler(async (req, res) => {
  const items = await ShopItem.findAll({ where: { disabled: false } })
  res.json(items)
}))

module.exports = router