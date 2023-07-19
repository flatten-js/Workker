const express = require('express')
const router = express.Router()

const { Stamp } = require('../models')
const { router_handler } = require('../utils')

router.post('/add', router_handler(async (req, res) => {
  const { marker_id, user_id } = req.body
  await Stamp.create({ marker_id, user_id })
	return res.json({})
}))

module.exports = router