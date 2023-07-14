const express = require('express')
const router = express.Router()

router.use('/project', require('./project.js'))
router.use('/marker', require('./marker.js'))
router.use('/stamp', require('./stamp.js'))

module.exports = router