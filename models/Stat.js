const { Schema, model } = require('mongoose')

const statSchema = new Schema({
  date: Date,
  total: Number,
  valid: Number
}, { versionKey: false })

statSchema.index({ date: 1}, { unique: true })

module.exports = model('Stat', statSchema)