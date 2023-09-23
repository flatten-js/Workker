const express = require('express')
const router = express.Router()

const { router_handler } = require('##/utils.js')
const { buy_shop_item } = require('##/stores/models/shop_item.js')
const { STRIPE_SECRET_API_KEY, STRIPE_SECRET_WEBHOOK_KEY } = require('##/config.js')

const stripe = require('stripe')(STRIPE_SECRET_API_KEY)

router.post('/payment', express.raw({ type: "application/json" }), router_handler(async (req, res) => {
  const signature = req.headers['stripe-signature']

  try {
    var event = stripe.webhooks.constructEvent(req.body, signature, STRIPE_SECRET_WEBHOOK_KEY)
  } catch (e) {
    return res.status(400).send(`Webhook Error: ${e.message}`)
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const { user_id, item_id } = event.data.object.metadata
      await buy_shop_item(user_id, item_id)      
      break
    
    default:
      console.warn(`Unhandled event type ${event.type}`)
  }

  res.send()
}))

module.exports = router