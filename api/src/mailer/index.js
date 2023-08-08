const nodemailer = require('nodemailer')

const { MAIL_FROM } = config('##/config.js')

const options = {}

const mail = {
  sender: MAIL_FROM,
  from: MAIL_FROM
}

function mail_options(to, subject, text) {
  return { ...mail, to, subject, text }
}

const transport = nodemailer.createTransport(options)

module.exports = { mail_options, transport }