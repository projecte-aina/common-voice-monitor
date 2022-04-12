const { Schema, model } = require('mongoose')

const logSchema = new Schema({
  date: Date,
  operation: String
}, { versionKey: false })


module.exports = model('Log', logSchema)