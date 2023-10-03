const jwt = require('jsonwebtoken')

const { TOKEN_COOKIE_NAME, JWT_SECRET } = require("##/config.js");

function verify(req) {
  const token = req.cookies[TOKEN_COOKIE_NAME]
  if (token) {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (e) {
      throw e
    }
  }
}

function baseAuthenticate(req, res, next, cond_cb) {
  try {
    const decoded = verify(req)
    if (cond_cb(decoded)) {
      req.decoded = decoded
      return next()
    }
  } catch (e) {
    res.clearCookie(TOKEN_COOKIE_NAME)
  }
  res.status(401).end()
}

async function authenticate(req, res, next) {
  baseAuthenticate(req, res, next, decoded => decoded.verified)
}

function unverifiedAuthenticate(req, res, next) {
  baseAuthenticate(req, res, next, decoded => !decoded.verified)
}

module.exports = { authenticate, unverifiedAuthenticate }