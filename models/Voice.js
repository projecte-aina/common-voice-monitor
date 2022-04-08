const { Schema, model } = require('mongoose')

const voiceSchema = new Schema({
  date: Date,
  value: Number,
}, { versionKey: false })

voiceSchema.index({ date: 1}, { unique: true })

module.exports = model('Voice', voiceSchema)