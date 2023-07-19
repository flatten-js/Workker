require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())

app.use('/api', require('./routes/api.js'))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('An error has occurred.')
})

app.listen(3030)