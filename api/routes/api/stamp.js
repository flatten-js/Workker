const express = require('express')
const router = express.Router()

const { authenticate } = require('##/middlewares/auth.js')

const { Stamp } = require('###/models')
const { router_handler } = require('##/utils.js')

router.post('/add', authenticate, router_handler(async (req, res) => {
  await Stamp.create({ marker_id: req.body.marker_id, user_id: req.decoded.user_id })
	return res.json({})
}))

module.exports = router