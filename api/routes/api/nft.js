const express = require('express')
const router = express.Router()

const { authenticate } = require('##/middlewares/auth.js')
const { router_handler } = require('##/utils.js')
const { Nft } = require('###/models')
const web3 = require('###/stores/web3')

router.get('/own', authenticate, router_handler(async (req, res) => {
  const nfts = await web3.own_nfts(req.decoded.user_id)
  res.json(nfts)
}))

router.post('/reveal', authenticate, router_handler(async (req, res) => {
  const { user_id } = req.decoded
  const { package_id, token_id } = req.body
  
  const nft = await Nft.findOne({ where: { user_id, package_id, token_id } })
  if (!nft) throw Error('User does not own NFT')

  await web3.contract.call(package_id, 'reveal', token_id)
  res.json({})
}))

module.exports = router