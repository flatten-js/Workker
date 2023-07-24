const express = require('express')
const router = express.Router()

const { Op } = require('sequelize')

const { sequelize, Project, Marker } = require('###/models')

const { verify, authenticate } = require('##/middlewares/auth.js')

const es = require('##/stores/elasticsearch.js')
const place = require('##/stores/place.js')

const { router_handler, retry } = require('##/utils.js')

router.get('/all', router_handler(async (req, res) => {
	const projects = await Project.findAll({ where: { public: true }, order: [['updatedAt', 'DESC']] })
	return res.json(projects)
}))

router.get('/user_id', authenticate, router_handler(async (req, res) => {
	const projects = await Project.findAll({ where: { user_id: req.decoded.user_id }, order: [['updatedAt', 'DESC']] })
	return res.json(projects)
}))

router.get('/get', router_handler(async (req, res) => {
	const decoded = verify(req)
	const project = await Project.findOne({ 
		where: { 
			id: req.query.project_id,
			[Op.or]: [
				{
					public: true
				},
				{
					public: false,
					user_id: decoded?.user_id
				}
			]
		} 
	})
	return res.json(project)
}))

router.post('/generate', authenticate, router_handler(async (req, res) => {
	const { title, description, location } = req.body

	const size = 10
	const radius = 500

	let near = await es.nearby(location, radius, size)
	if (!near.places.length || near.latest_timestamp <= Date.now() - (1000 * 60 * 60 * 24 * 7)) {
		const results = await place.nearby(location, radius)
		if (results.length) {
			await es.bulk(results, place => {
				const { name, geometry: { location } } = place
				return { name, location: [location.lat, location.lng].join(',') }
			})
			near = await retry(5, 1000, () => es.nearby(location, radius, size), result => result.places.length)
		}
	}

	if (near.places.length) {
		await sequelize.transaction(async transaction => {
			const project = await Project.create({ 
				user_id: req.decoded.user_id, 
				title, 
				description 
			}, { transaction })
			
			for (const place of near.places) {
				await Marker.create({
					project_id: project.id,
					title: place.name,
					description: place.name,
					position: place.location.split(','),
					radius: 40
				}, { transaction })
			}
		})

		return res.json({})
	}

	return res.status(500).send('No spots were found in the vicinity.')
}))

module.exports = router