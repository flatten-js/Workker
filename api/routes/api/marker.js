const express = require('express')
const router = express.Router()

const { Op } = require('sequelize')

const { authenticate } = require('##/middlewares/auth.js')

const { Marker, Stamp } = require('###/models')
const { router_handler } = require('##/utils.js')

router.get('/all', authenticate, router_handler(async (req, res) => {
	const markers = await Marker.findAll({ 
		where: { project_id: req.query.project_id },
		include: [
			{ 
				model: Stamp, 
				required: false,
				where: {
					user_id: {
						[Op.eq]: req.decoded.user_id
					}
				}
			}
		]
	})
	return res.json(markers)
}))

module.exports = router