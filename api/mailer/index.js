const transport = require('./transport.js')
const template = require('./template.js')

const { MAIL_USER } = require('##/config.js')

class Mailer { 
  static mail_options(to, subject, html) {
    return {
      sender: MAIL_USER,
      from: {
        name: 'waylap.com',
        address: MAIL_USER
      },
      to,
      subject,
      html
    }
  }

  static async send(to, subject, html) {
    const options = Mailer.mail_options(to, subject, html)
    return await transport.sendMail(options)
  }

  static async activate_account(to, token) {
    const body = template.activate_account(token)
    return Mailer.send(to, ...body)
  }
}

module.exports = Mailer