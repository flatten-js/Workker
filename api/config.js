const APP_URL = process.env.APP_URL || 'https://localhost'

const GCP_PLACE_APIKEY = process.env.GCP_PLACE_APIKEY

const PASSWORD_SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS)
const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME || 'jwt_token'

const MAIL_SMTP_HOST = process.env.MAIL_SMTP_HOST
const MAIL_SMTP_PORT = process.env.MAIL_SMTP_PORT
const MAIL_USER = process.env.MAIL_USER
const MAIL_PASS = process.env.MAIL_PASS


module.exports = {
  APP_URL,
  GCP_PLACE_APIKEY,
  PASSWORD_SALT_ROUNDS,
  JWT_SECRET,
  TOKEN_COOKIE_NAME,
  MAIL_SMTP_HOST,
  MAIL_SMTP_PORT,
  MAIL_USER,
  MAIL_PASS
}