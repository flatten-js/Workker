const express = require('express')
const router = express.Router()

const { Op } = require('sequelize')

const { sequelize, Project, Marker, Stamp, User, ProjectReport } = require('###/models')
const { authenticate } = require('##/middlewares/auth.js')
const { router_handler } = require('##/utils.js')
const { 
	to_positions, 
	origin_position,
	order_by_markers, 
	order_by_distance, 
	total_distance,
	nearby
} = require('##/lib/geo.js')

const LIMIT = 10

router.get('/all', authenticate, router_handler(async (req, res) => {
	const { page } = req.query
	
	const projects = await Project.findAll({ 
		where: { public: true }, 
		order: [['updatedAt', 'DESC']], 
		limit: LIMIT,
		offset: (page - 1) * LIMIT
	})

	return res.json(projects)
}))

router.get('/all/count', authenticate, router_handler(async (req, res) => {
	let count = await Project.count({ where: { public: true } })
	count = Math.ceil(count / LIMIT) || 1
	return res.json(count)
}))

router.get('/all/my', authenticate, router_handler(async (req, res) => {
	const _public = req.query.public

	const projects = await Project.findAll({ 
		where: { 
			user_id: req.decoded.user_id,
			...(_public != void 0 ? { public: JSON.parse(_public) } : {})
		}, 
		order: [['updatedAt', 'DESC']] 
	})

	return res.json(projects)
}))

router.get('/all/trying', authenticate, router_handler(async (req, res) => {
	const { user_id } = req.decoded
	
	const models = await Stamp.findAll({
		attributes: [],
		where: { user_id },
		include: [
			{
				model: Marker,
				attributes: [],
				include: [
					{ 
						model: Project,
						paranoid: false
					}
				]
			}
		],
		group: ['Marker.Project.id'],
		nest: true,
		raw: true
	})

	const reports = await ProjectReport.findAll({
		attributes: ['project_id'],
		where: { user_id }
	})

	const projects = models
		.map(model => model.Marker.Project)
		.filter(project => reports.every(report => report.project_id != project.id))
		
	res.json(projects)
}))

router.get('/all/reported', authenticate, router_handler(async (req, res) => {
	const models = await ProjectReport.findAll({
		attributes: [], 
		where: { user_id: req.decoded.user_id }, 
		include: [
			{ 
				model: Project,
				paranoid: false 
			}
		],
		order: [['updatedAt', 'DESC']],
		nest: true,
		raw: true
	})
	
	const projects = models.map(model => model.Project)
	return res.json(projects)
}))

router.get('/get', authenticate, router_handler(async (req, res) => {
	const { user_id } = req.decoded
	const { project_id } = req.query

	let project = await Project.findOne({ 
		where: { 
			id: project_id,
			[Op.or]: [
				{
					public: true
				},
				{
					public: false,
					user_id
				}
			]
		}
	})

	if (!project) {
		project = await Project.findOne({
			where: { id: project_id },
			include: {
				model: Marker,
				attributes: [],
				required: true,
				include: {
					model: Stamp,
					attributes: [],
					required: true,
					where: { user_id }
				}
			},
			paranoid: false
		})

	}

	return res.json(project)
}))

router.post('/create', authenticate, router_handler(async (req, res) => {
	const { title, description, position, radius, allocate } = req.body
	let { markers } = req.body

	const 
		MAX_SIZE = 10, 
		RADIUS = 500, 
		TICKET_WEIGHT = 1000,
		MIN_DISTANCE = 500

	markers = markers.slice(0, MAX_SIZE)

	if (allocate) {
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
	}

	if (markers.length) {
		let positions = to_positions(markers)
		positions = order_by_distance(positions)
		markers = order_by_markers(markers, positions)
		const distance = total_distance(positions)

		const charge = Math.floor((distance / TICKET_WEIGHT) * 10) / 10
		const rate = markers.length / MAX_SIZE

		await sequelize.transaction(async transaction => {
			const project = await Project.create({ 
				user_id: req.decoded.user_id, 
				title, 
				description: description || void 0,
				radius,
				distance,
				charge: distance >= MIN_DISTANCE ? Math.min(charge * rate, 5) : 0
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
	const { user_id } = req.decoded
	const { project_id } = req.body

	const project = await Project.findOne({ where: { id: project_id, user_id } })

	if (!project) {
		throw new Error('An invalid project ID was specified')
	}

	const markers = await Marker.findAll({
		attributes: ['id'],
		where: { project_id }
	})

	const marker_ids = markers.map(marker => marker.id)

	const stamp = await Stamp.count({
		where: {
			marker_id: {
				[Op.in]: marker_ids
			},
			user_id: {
				[Op.ne]: user_id
			}
		}
	})

	if (0 < stamp) {
		await project.destroy()
	} else {
		await sequelize.transaction(async transaction => {
			await Stamp.destroy({
				where: {
					marker_id: {
						[Op.in]: marker_ids
					}
				},
				force: true
			}, { transaction })

			await project.destroy({ force: true }, { transaction })
		})
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

	const is_reported = await ProjectReport.findOne({ where: { project_id, user_id } })
	if (is_reported) throw Error('Already reported in this project')

	const project = await Project.findOne({ where: { id: project_id }, paranoid: false })
	await sequelize.transaction(async transaction => {
		const user = await User.findOne({ where: { id: user_id }, lock: true }, { transaction })
		user.charge += project.charge
		await user.save({ transaction })
		await ProjectReport.create({ project_id, user_id }, { transaction })
	})

	res.json({})
}))

router.get('/reported', authenticate, router_handler(async (req, res) => {
	const { user_id } = req.decoded
	const { project_id } = req.query
	const reported = await ProjectReport.findOne({ where: { project_id, user_id } })
	res.json(!!reported)
}))

router.post('/public', authenticate, router_handler(async (req, res) => {
	const { user_id } = req.decoded
	const { project_id, is_public } = req.body
	await Project.update({ public: !!is_public }, { where: { id: project_id, user_id } })
	res.json({})
}))

router.post('/drop', authenticate, router_handler(async (req, res) => {
	const markers = await Marker.findAll({
		attributes: ['id'],
		where: {
			project_id: req.body.project_id
		}
	})

	await Stamp.destroy({
		where: {
			user_id: req.decoded.user_id,
			marker_id: {
				[Op.in]: markers.map(marker => marker.id)
			}
		},
		force: true
	})

	res.json({})
}))

module.exports = router