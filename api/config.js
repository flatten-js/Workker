const APP_URL = process.env.APP_URL || 'https://localhost'

const GCP_PLACE_APIKEY = process.env.GCP_PLACE_APIKEY

const PASSWORD_SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS)
const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME || 'jwt_token'

const MAIL_SMTP_HOST = process.env.MAIL_SMTP_HOST
const MAIL_SMTP_PORT = process.env.MAIL_SMTP_PORT
const MAIL_USER = process.env.MAIL_USER
const MAIL_PASS = process.env.MAIL_PASS

NFT_PROVIDER = process.env.NFT_PROVIDER || 'http://blockchain:8545'
NFT_OWNER_ADDRESS = process.env.NFT_OWNER_ADDRESS
NFT_OWNER_PRIVATE_KEY = process.env.NFT_OWNER_PRIVATE_KEY
NFT_STORAGE_PATH = process.env.NFT_STORAGE_PATH || './storage/develop.vol.1/metadata'

METADATA_PUBLIC_KEY = (process.env.METADATA_PUBLIC_KEY || '').replace(/\\n/g, '\n')
METADATA_PRIVATE_KEY = (process.env.METADATA_PRIVATE_KEY || '').replace(/\\n/g, '\n')
METADATA_PATH = process.env.METADATA_PATH || 'https://localhost/storage/{package}/nfts/{image}'

module.exports = {
  APP_URL,
  GCP_PLACE_APIKEY,
  PASSWORD_SALT_ROUNDS,
  JWT_SECRET,
  TOKEN_COOKIE_NAME,
  MAIL_SMTP_HOST,
  MAIL_SMTP_PORT,
  MAIL_USER,
  MAIL_PASS,
  NFT_PROVIDER,
  NFT_OWNER_ADDRESS,
  NFT_OWNER_PRIVATE_KEY,
  NFT_STORAGE_PATH,
  METADATA_PUBLIC_KEY,
  METADATA_PRIVATE_KEY,
  METADATA_PATH
}