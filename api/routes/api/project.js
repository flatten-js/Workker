const express = require('express')
const router = express.Router()

const { Op } = require('sequelize')

const { sequelize, Project, Marker, Stamp, User, projectReport } = require('###/models')
const { verify, authenticate } = require('##/middlewares/auth.js')
const { router_handler } = require('##/utils.js')
const { 
	to_positions, 
	origin_position,
	order_by_markers, 
	order_by_distance, 
	total_distance,
	nearby
} = require('##/lib/geo.js')

router.get('/all', authenticate, router_handler(async (req, res) => {
	const projects = await Project.findAll({ where: { public: true }, order: [['updatedAt', 'DESC']] })
	return res.json(projects)
}))

router.get('/user_id', authenticate, router_handler(async (req, res) => {
	const projects = await Project.findAll({ where: { user_id: req.decoded.user_id }, order: [['updatedAt', 'DESC']] })
	return res.json(projects)
}))

router.get('/get', authenticate, router_handler(async (req, res) => {
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

router.post('/create', authenticate, router_handler(async (req, res) => {
	const { title, description, position, radius } = req.body
	let { markers } = req.body

	const MAX_SIZE = 10, RADIUS = 500, TICKET_WEIGHT = 1000

	markers = markers.slice(0, MAX_SIZE)
	const current_size = markers.length
	const size = MAX_SIZE - markers.length

	let center_position = position
	let center_radius = RADIUS
	if (current_size == 1) {
		center_position = markers[0].position
	} else if (current_size >= 2) {
		const positions = to_positions(markers)
		const geo_position = origin_position(positions)
		center_position = geo_position.center_position
		center_radius = geo_position.distance
	}

	const near = await nearby(center_position, center_radius, size)
	markers = [...markers, ...near.places]
	if (markers.length == MAX_SIZE) {
		let positions = to_positions(markers)
		positions = order_by_distance(positions)
		markers = order_by_markers(markers, positions)
		const distance = total_distance(positions)

		await sequelize.transaction(async transaction => {
			const project = await Project.create({ 
				user_id: req.decoded.user_id, 
				title, 
				description,
				radius,
				distance,
				ticket: Math.min(Math.trunc(distance / TICKET_WEIGHT), 5)
			}, { transaction })
			
			for (const marker of markers) {
				await Marker.create({
					project_id: project.id,
					title: marker.title,
					description: marker.description || marker.title,
					position: marker.position,
					radius: marker.radius || void 0
				}, { transaction })
			}
		})

		return res.json({})
	}

	return res.status(500).send('No spots were found in the vicinity.')
}))

router.post('/delete', authenticate, router_handler(async (req, res) => {
	const project = await Project.findOne({ 
		where: { 
			id: req.body.project_id, 
			user_id: req.decoded.user_id 
		} 
	})

	if (project) {
		await project.destroy()
	} else {
		throw new Error('An invalid project ID was specified')
	}

	res.json({})
}))

router.post('/report', authenticate, router_handler(async (req, res) => {
	const { user_id } = req.decoded
	const { project_id } = req.body

	const markers = await Marker.findAll({ 
		where: { project_id },
		include: [
			{ 
				model: Stamp, 
				required: false,
				where: {
					user_id: {
						[Op.eq]: user_id
					}
				}
			}
		]
	})

	const can_report = markers.every(market => market.Stamps.length)
	if (!can_report) {
		return res.status(500).send('There are some spots that are not stamped')
	}

	const is_reported = await projectReport.findOne({ where: { project_id, user_id } })
	if (is_reported) throw Error('Already reported in this project')

	const project = await Project.findOne({ where: { id: project_id } })
	await sequelize.transaction(async transaction => {
		const user = await User.findOne({ where: { id: user_id }, lock: true }, { transaction })
		user.ticket += project.ticket
		await user.save({ transaction })
		await projectReport.create({ project_id, user_id }, { transaction })
	})
}))

router.get('/reported', authenticate, router_handler(async (req, res) => {
	const { user_id } = req.decoded
	const { project_id } = req.query
	const reported = await projectReport.findOne({ where: { project_id, user_id } })
	res.json(!!reported)
}))

module.exports = router