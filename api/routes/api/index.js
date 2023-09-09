const express = require('express')
const router = express.Router()

router.use('/project', require('./project.js'))
router.use('/marker', require('./marker.js'))
router.use('/stamp', require('./stamp.js'))

router.use('/user', require('./user.js'))
router.use('/exchange', require('./exchange.js'))
router.use('/nft', require('./nft.js'))

module.exports = router