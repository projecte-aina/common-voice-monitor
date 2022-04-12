require("../store/mongo")
const Voice = require("../models/Voice")
const { insertError } = require('../utils/logger')

const addVoices = async (voices) => {

  let inserted = []

  for (let v of voices) {

    const voice = new Voice({
      date: v.date,
      value: v.value
    })

    try {
      await voice.save()
      inserted.push(voice)
    }catch (e) {
      await insertError(e, 'On save voice')
    }
  }

  return inserted
}

module.exports = {
  addVoices
}

