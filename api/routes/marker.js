const express = require('express')
const router = express.Router()

const { Marker, Stamp } = require('../models')

router.get('/all', async (req, res) => {
	const markers = await Marker.findAll({ 
		where: { project_id: req.query.project_id },
		include: [
			{ model: Stamp, required: false }
		]
	})
	return res.json(markers)
})

module.exports = router