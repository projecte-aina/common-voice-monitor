const { Schema, model } = require('mongoose')

const clipVoteSchema = new Schema({
  date: Date,
  clips: Number,
  votes: Number
}, { versionKey: false })

clipVoteSchema.index({ date: 1}, { unique: true })

module.exports = model('ClipVote', clipVoteSchema)