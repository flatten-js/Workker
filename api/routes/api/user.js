const express = require('express')
const router = express.Router()

const { authenticate } = require('##/middlewares/auth.js')

const { User } = require('###/models')
const { router_handler } = require('##/utils.js')

router.get('/get', authenticate, router_handler(async (req, res) => {
  const user = await User.findOne({ where: { id: req.decoded.user_id } })
	return res.json({ ticket: user.ticket })
}))

module.exports = router