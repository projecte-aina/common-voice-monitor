const { Schema, model } = require('mongoose')

const dailyReportSchema = new Schema({
    date: Date,
    createdAt: Date,
    cuts: Number,
    accumulated_cuts_aina: Number,
    total_accumulated_cuts: Number,
    valid_cuts: Number,
    valid_cuts_aina: Number,
    total_valid_cuts: Number,
    recorded_hours: Number,
    recorded_hours_aina: Number,
    total_hours: Number,
    valid_hours: Number,
    valid_hours_aina: Number,
    total_valid_hours: Number,
    speakers: Number,
}, { versionKey: false })

dailyReportSchema.index({ date: 1}, { unique: true })

module.exports = model('DailyReport', dailyReportSchema)