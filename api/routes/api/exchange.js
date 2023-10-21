const express = require('express')
const router = express.Router()

const { authenticate } = require('##/middlewares/auth.js')

const { router_handler } = require('##/utils.js')
const { sequelize, Package, Nft, User } = require('###/models')
const web3 = require('###/stores/web3')

router.post('/', authenticate, router_handler(async (req, res) => {
  const { user_id } = req.decoded
  const { package_id } = req.body

  const package = await Package.findOne({ where: { id: package_id } })

  const token_id = await sequelize.transaction(async transaction => {
    const user = await User.findOne({ where: { id: user_id }, lock: true }, { transaction })
    user.ticket -= package.ticket
    if (user.ticket < 0) throw Error('Not enough tickets')
    await user.save({ transaction })

    return await web3.contract.call(package_id, 'mint')
  })

  await Nft.create({ user_id, package_id, token_id })

  res.json({})
}))

router.get('/packages', authenticate, router_handler(async (req, res) => {
  let packages = await Package.findAll({ where: { disabled: false } })
  packages = await Promise.all(packages.map(async package => {
    const image = web3.package_url(package.bucket)
    let supply = {}
    try {
      supply.max = ''+(await web3.contract.call(package.id, 'maxSupply'))
      supply.total = ''+(await web3.contract.call(package.id, 'totalSupply'))
    } catch (e) {
      console.error(e)
      supply = {}
    }
    return { ...package.toJSON(), image, supply }
  }))
  res.json(packages)
}))

module.exports = router