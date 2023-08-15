const Waylap = artifacts.require('Waylap.sol')

module.exports = async (deployer, network, accounts) => {
  const args = ['http://localhost:3030/storage/develop.vol.1/metadata/', 'http://localhost:3030/storage/develop.vol.1/package.json', 99999]
  await deployer.deploy(Waylap, ...args, { from: accounts[0] })
}