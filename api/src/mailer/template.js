const { mail_options } = require('./index.js')
const { APP_URL } = require('##/config.js')

function account_verfication(to, token) {
  const subject = 'Account Verification'
  const html = `
    <h1>Verify your email address</h1>
    <p>Thank you for signing up for Waylap!</p>
    <p>To use your account, you will need to confirm your email address</p>
    <p>Please click the button below to verify that the email address is yours</p>
    <a href="${APP_URL}/auth/email/${token}">Verify Email Address</a>
    <p>Note: The above buttons have a 24-hour expiration date</p>
  `
  return mail_options(to, subject, html)
}

module.exports = {
  account_verfication
}
