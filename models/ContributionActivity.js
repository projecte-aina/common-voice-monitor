const { Schema, model } = require('mongoose')

const contributionActivitySchema = new Schema({
  date: Date,
  value: Number,
}, { versionKey: false })

contributionActivitySchema.index({ date: 1}, { unique: true })

module.exports = model('ContributionActivitie', contributionActivitySchema)