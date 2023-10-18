const fs = require('fs').promises

const { sequelize, Package, PackageNft } = require('./models')

const command = process.argv[2]
const args = process.argv.slice(3)

;(async () => {
  switch (command) {
    case 'deploy': {
      const [bucket, contract_address] = args
      const json = await fs.readFile('/dev/stdin', 'utf-8')
      const { package: package_data, nfts } = JSON.parse(json)

      await sequelize.transaction(async transaction => {
        const package = await Package.create({ ...package_data, bucket, contract_address }, { transaction })
        for (const nft of nfts) {
          await PackageNft.create({ ...nft, package_id: package.id }, { transaction })
        }
      })
    }
  }
})()
