const express = require('express')
const router = express.Router()

const { Project } = require('../models')

router.get('/all', async (req, res) => {
	const projects = await Project.findAll()
	return res.json(projects)
})

router.get('/get', async (req, res) => {
	const project = await Project.findOne({ where: { id: req.query.project_id } })
	return res.json(project)
})

module.exports = router