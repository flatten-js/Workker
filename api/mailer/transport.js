const nodemailer = require('nodemailer')

const { 
  MAIL_SMTP_HOST, 
  MAIL_SMTP_PORT, 
  MAIL_USER,
  MAIL_PASS
} = require('##/config.js')

const options = {
  host: MAIL_SMTP_HOST,
  port: MAIL_SMTP_PORT,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
}

const transport = nodemailer.createTransport(options)

module.exports = transport