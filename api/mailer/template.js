const { mail_options } = require('./index.js')
const { APP_URL } = require('##/config.js')

function account_activation(to, token) {
  const subject = 'Account Activation'
  const html = `
    <h1>Account Activation</h1>
    <p>Thank you for signing up for Waylap.com!</p>
    <p>To use your account, you will need to confirm your email address</p>
    <p>Click on the link below to activate your account.</p>
    <a href="${APP_URL}/auth/email/${token}">Activate your account</a>
    <p>Note: The above buttons have a 1-hour expiration date</p>
  `
  return mail_options(to, subject, html)
}

module.exports = {
  account_activation
}
