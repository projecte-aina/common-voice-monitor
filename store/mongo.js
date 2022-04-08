const { mongo } = require('../config')
const mongoose = require('mongoose')

require('dotenv').config()

const uri = mongo.uri


mongoose.connect(uri)

const db = mongoose.connection

db.on('open', _ => {
  console.log(`Database connected to ${uri}`)
})

db.on('error', err => {
  console.log(`Database error: ${err}`)
})