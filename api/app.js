require('dotenv').config()

const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')

app.use((req, res, next) => {
  if (req.path.includes('/webhook')) {
    next()
  } else {
    express.json()(req, res, next)
  }
})

app.use(cookieParser())

app.use('/storage', express.static('./storage'))

app.use('/api', require('./routes/api'))
app.use('/auth', require('./routes/auth'))
app.use('/webhook', require('./routes/webhook'))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('An error has occurred.')
})

app.listen(3030)