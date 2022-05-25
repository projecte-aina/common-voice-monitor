const { mongo } = require('../../config')
const mongoose = require('mongoose')

require('dotenv').config()

const uri = process.env.MONGO_URI || "mongodb://129.151.225.145:49153/commonvoice_monitor"


mongoose.connect(uri)

const db = mongoose.connection

db.on('open', _ => {
  console.log(`Database connected to ${uri}`)
})

db.on('error', err => {
  console.log(`Database error: ${err}`)
})
