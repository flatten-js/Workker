const express = require('express')
const router = express.Router()

const { authenticate } = require('##/middlewares/auth.js')

const { router_handler } = require('##/utils.js')
const { sequelize, Package, Nft, User } = require('###/models')
const web3 = require('###/stores/web3')

router.get('/packages', authenticate, router_handler(async (req, res) => {
  const packages = await Package.findAll({ where: { disabled: false } })
  res.json(packages)
}))

router.post('/exchange', authenticate, router_handler(async (req, res) => {
  const { user_id } = req.decoded
  const { package_id } = req.body

  const package = await Package.findOne({ where: { id: package_id } })

  const token_id = await sequelize.transaction(async transaction => {
    const user = await User.findOne({ where: { id: user_id }, lock: true }, { transaction })
    user.ticket -= package.require_ticket
    if (user.ticket < 0) throw Error('Not enough tickets')
    await user.save({ transaction })

    return await web3.contract.call(package_id, 'mint')
  })

  await Nft.create({ user_id, package_id, token_id })

  res.json({})
}))

module.exports = router