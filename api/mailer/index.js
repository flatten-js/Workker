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

const mail = {
  sender: MAIL_USER,
  from: MAIL_USER
}

function mail_options(to, subject, text) {
  return { ...mail, to, subject, text }
}

const transport = nodemailer.createTransport(options)

module.exports = { mail_options, transport }