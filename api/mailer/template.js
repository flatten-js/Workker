function activate_account(code) {
  const subject = 'Request to activate your account'
  const html = `
    <h1>Account Activation</h1>
    <p>Thank you for signing up for Waylap.com!</p>
    <p>To use your account, you will need to verification your email address</p>
    <p>Please enter the following verification code on the site to activate your account</p>
    <h2>${code}</h2>
    <p>Note: The verification code is valid for 10 minutes</p>
  `
  return [subject, html]
}

module.exports = {
  activate_account
}