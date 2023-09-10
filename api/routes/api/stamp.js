const express = require('express')
const router = express.Router()

const geolib = require('geolib')

const { authenticate } = require('##/middlewares/auth.js')

const { Marker, Project, Stamp } = require('###/models')
const { router_handler } = require('##/utils.js')

router.post('/add', authenticate, router_handler(async (req, res) => {
  const { marker_id, position } = req.body

  const marker = await Marker.findOne({ 
    where: {
      id: marker_id 
    },
    include: {
      model: Project, 
      required: true
    } 
  })
  if (!marker) throw Error('Marker does not exist')

  let created = false

  const distance = geolib.getPreciseDistance(marker.position, position)
  if (distance <= (marker.radius || marker.Project.radius)) {
    await Stamp.create({ marker_id, user_id: req.decoded.user_id })
    created = true
  }

  return res.json(created)
}))

module.exports = router