const APP_URL = process.env.APP_URL || 'https://localhost'
const GCP_PLACE_APIKEY = process.env.GCP_PLACE_APIKEY
const PASSWORD_SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS)
const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME || 'jwt_token'
const MAIL_FROM = process.env.MAIL_FROM

module.exports = {
  APP_URL,
  GCP_PLACE_APIKEY,
  PASSWORD_SALT_ROUNDS,
  JWT_SECRET,
  TOKEN_COOKIE_NAME,
  MAIL_FROM
}