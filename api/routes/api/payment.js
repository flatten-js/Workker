const express = require('express')
const router = express.Router()

const { authenticate } = require('##/middlewares/auth.js')
const { ShopItem } = require('###/models')
const { router_handler } = require('##/utils.js')
const { STRIPE_SECRET_API_KEY } = require('##/config.js')

const stripe = require('stripe')(STRIPE_SECRET_API_KEY)

router.post('/intent', authenticate, router_handler(async (req, res) => {
  const { user_id } = req.decoded
  const { item_id } = req.body

  const item = await ShopItem.findOne({ where: { id: item_id } })
  const intent = await stripe.paymentIntents.create({
    amount: item.amount,
    currency: 'jpy',
    metadata: { user_id, item_id }
  })

  res.json(intent.client_secret)
}))

module.exports = router