const fs = require('fs').promises
const path = require('path')
const crypto = require('crypto')

const axios = require('axios')
const { Web3 } = require('web3')

const { 
  NFT_PROVIDER, 
  NFT_OWNER_ADDRESS, 
  NFT_OWNER_PRIVATE_KEY,
  NFT_STORAGE_PATH,
  METADATA_PUBLIC_KEY,
  METADATA_PRIVATE_KEY,
  METADATA_PATH
} = require('##/config.js')
const { Nft, Package, PackageNft } = require('###/models')

const abi = require('./abi.json')

const web3 = new Web3(new Web3.providers.HttpProvider(NFT_PROVIDER))

function metadata_path(token_id) {
  return path.join(NFT_STORAGE_PATH, ''+token_id)
}

async function upload_metadata(token_id, metadata) {
  await fs.writeFile(metadata_path(token_id), JSON.stringify(metadata))
}

function pickup_nft(nfts) {
  const weight = nfts.reduce((acc, cur) => acc + cur.rate, 0)
  const x = (crypto.randomBytes(4).readUInt32LE() / 0xffffffff) * weight
  let y = 0
  return nfts.find(nft => { y += nft.rate; return x < y })
}

function token_serialize(token_id, max_token) {
  const max_token_length = max_token.length
  return ('0'.repeat(max_token_length)+token_id).slice(-max_token_length)
}

async function create_metadata(package, nft, token_id, max_token) {
  const metadata = { 
    name: `${nft.name} #${token_serialize(token_id, max_token)}`, 
    description: nft.description, 
    image: METADATA_PATH.replace('{package}', package.name).replace('{image}', `${nft.name}.png`)
  }

  const encrypt_metadata = crypto.publicEncrypt(
    {
      key: Buffer.from(METADATA_PUBLIC_KEY),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    }, 
    Buffer.from(JSON.stringify(metadata))
  )

  return { data: encrypt_metadata.toString('hex') }
}

async function call_ownable_method(contract, method, ...args) {
  const transaction = contract.methods[method](...args)
  const options = { 
    to: contract.options.address, 
    from: NFT_OWNER_ADDRESS,
    data: transaction.encodeABI(),
    gas: await transaction.estimateGas({ from: NFT_OWNER_ADDRESS }),
    gasPrice: web3.utils.toWei(50, 'gwei'),
  }
  const signedTransaction = await web3.eth.accounts.signTransaction(options, NFT_OWNER_PRIVATE_KEY)
  return await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
}

async function mint(package, contract) {
  const package_nfts = await PackageNft.findAll({ where: { package_id: package.id } })
  const nft = pickup_nft(package_nfts)

  const receipt = await call_ownable_method(contract, 'safeMint')
  const { logs } = await web3.eth.getTransactionReceipt(receipt.transactionHash)
  const token_id = web3.utils.hexToNumber(logs[0].topics[3])

  const metadata = await create_metadata(package, nft, token_id, "99999")
  await upload_metadata(token_id, metadata)
  
  return token_id
}

async function reveal(package, contract, token_id) {
  const token_uri = metadata_path(token_id)
  const data = await fs.readFile(token_uri)

  const metadata = crypto.privateDecrypt(
    {
      key: Buffer.from(METADATA_PRIVATE_KEY),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    }, 
    Buffer.from(JSON.parse(data).data, 'hex')
  )

  const result = await call_ownable_method(contract, 'reveal', token_id)
  await upload_metadata(token_id, JSON.parse(metadata.toString()))

  return result
}

function maxSupply(package_id, contract) {
  return contract.methods.maxSupply().call()
}

function totalSupply(package_id, contract) {
  return contract.methods.totalSupply().call()
}

async function own_nfts(user_id, token_id) {
  let nfts = await Nft.findAll({ 
    where: { user_id, ...(token_id ? { token_id } : {}) }, 
    include: { 
      model: Package, 
      required: true
    } 
  })

  nfts = await Promise.all(nfts.map(async nft => {
    const result = {
      id: nft.id,
      package_id: nft.package_id,
      name: nft.Package.name,
      contract_address: nft.Package.contract_address,
      token_id: nft.token_id,
      description: nft.Package.description
    }

    try {
      const contract = new web3.eth.Contract(abi, nft.Package.contract_address)
      const token_uri = await contract.methods.tokenURI(nft.token_id).call()
      const { data } = await axios.get(token_uri)
      const revealed = await contract.methods.isRevealed(nft.token_id).call()
      result.metadata = { ...data, revealed } 
    } catch (e) {
      console.error(e.message)
    }

    return result
  })) 
  
  return nfts.filter(Boolean)
}

async function call(package_id, method, ...args) {
  const package = await Package.findOne({ where: { id: package_id } })
  const contract = new web3.eth.Contract(abi, package.contract_address)
  return await this[method](package, contract, ...args)
}

module.exports = {
  create_metadata, 
  call_ownable_method,
  own_nfts,
  contract: {
    mint,
    reveal,
    maxSupply,
    totalSupply,
    call
  }
}