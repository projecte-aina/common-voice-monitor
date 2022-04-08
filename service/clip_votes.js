require("../store/mongo")
const ClipVote = require("../models/ClipVote")
const { insertError } = require('../utils/logger')
const { DateTime } = require('luxon')

const addClipVote = async ({ clipsCount, votesCount }) => {

  const clipVote = new ClipVote({
    date: DateTime.now().toUTC(),
    clips: clipsCount,
    votes: votesCount,


  })
  try {
    return await clipVote.save()

  }catch (e) {
    await insertError(e, "On save clip votes")
  }
}

module.exports = {
  addClipVote
}

