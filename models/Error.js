const { Schema, model } = require('mongoose')

const errorSchema = new Schema({
  date: Date,
  message: String,
  operation: String
}, { versionKey: false })


module.exports = model('Error', errorSchema)