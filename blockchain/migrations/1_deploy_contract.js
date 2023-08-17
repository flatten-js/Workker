const Waylap = artifacts.require('Waylap.sol')

module.exports = async (deployer, network, accounts) => {
  const { REVEALED_URI, NOT_REVEALED_URI, MAX_TOKEN } = process.env
  const args = [REVEALED_URI, NOT_REVEALED_URI, parseInt(MAX_TOKEN)]
  await deployer.deploy(Waylap, ...args, { from: accounts[0] })
}

