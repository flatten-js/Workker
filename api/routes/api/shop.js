const express = require('express')
const router = express.Router()

const { authenticate } = require('##/middlewares/auth.js')

const { ShopItem } = require('###/models')
const { router_handler } = require('##/utils.js')

router.get('/items', authenticate, router_handler(async (req, res) => {
  const items = await ShopItem.findAll({ where: { disabled: false } })
  res.json(items)
}))

module.exports = router