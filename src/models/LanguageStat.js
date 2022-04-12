const { Schema, model } = require('mongoose')

const languageStatSchema = new Schema({
  date: Date,
  inProgress: [],
  launched: []
}, { versionKey: false })

languageStatSchema.index({ date: 1}, { unique: true })

module.exports = model('LanguageStat', languageStatSchema)