require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())

app.use('/api', require('./routes/api.js'))

app.listen(3030)