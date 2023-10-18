const APP_URL = process.env.APP_URL || 'https://localhost'

const GCP_PLACE_APIKEY = process.env.GCP_PLACE_APIKEY

const PASSWORD_SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS)
const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME || 'jwt_token'

const MAIL_SMTP_HOST = process.env.MAIL_SMTP_HOST
const MAIL_SMTP_PORT = process.env.MAIL_SMTP_PORT
const MAIL_USER = process.env.MAIL_USER
const MAIL_PASS = process.env.MAIL_PASS

const NFT_PROVIDER = process.env.NFT_PROVIDER || 'http://blockchain:8545'
const NFT_OWNER_ADDRESS = process.env.NFT_OWNER_ADDRESS
const NFT_OWNER_PRIVATE_KEY = process.env.NFT_OWNER_PRIVATE_KEY
const NFT_STORAGE_PATH = process.env.NFT_STORAGE_PATH || 'https://{bucket}.s3.ap-northeast-1.amazonaws.com'

const METADATA_PUBLIC_KEY = (process.env.METADATA_PUBLIC_KEY || '').replace(/\\n/g, '\n')
const METADATA_PRIVATE_KEY = (process.env.METADATA_PRIVATE_KEY || '').replace(/\\n/g, '\n')

const STRIPE_SECRET_API_KEY = process.env.STRIPE_SECRET_API_KEY
const STRIPE_SECRET_WEBHOOK_KEY = process.env.STRIPE_SECRET_WEBHOOK_KEY

const REDIS_URL = process.env.REDIS_URL

const REDIS_VCODE_PREFIX = process.env.REDIS_VCODE_PREFIX || 'VCODE'

const AWS_S3_REGION = process.env.AWS_S3_REGION || 'ap-northeast-1'

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
  STRIPE_SECRET_API_KEY,
  STRIPE_SECRET_WEBHOOK_KEY,
  REDIS_URL,
  REDIS_VCODE_PREFIX,
  AWS_S3_REGION
}