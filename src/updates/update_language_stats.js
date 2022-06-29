const EventEmitter = require('events');
const { getLanguageStats } = require('../api/commonvoice')
const { DateTime } = require('luxon')
const { addLanguageStat } = require('../service/language_stat')
const { addElement, loadDocument} = require('../store/spread_sheet')
const { insertLog, insertError } = require('../utils/logger')
const {sheets} = require("../../config");

const eventEmitter = new EventEmitter();


eventEmitter.on('add_language_stat_element_sheet', async (languageStats) => {

    const element = languageStats['languages'].find(e => e.locale === 'ca')
    const forSheet = { data: languageStats.date, 'hores gravades': element.recordedHours, 'hores valides': element.validatedHours, parlants: element.speakersCount, frases: element.sentencesCount.currentCount }

    const newDoc = await loadDocument({id: sheets.multiple_id})

    await addElement({doc: newDoc, sheetName: 'Total', obj: forSheet})
    await insertLog(`Updated language stats inserted to google sheet document`)
});



const updateLanguageStats = async () => {

  try {
    console.log(`[${DateTime.now().toUTC()}] Updating language stats..`)

    const languages = await getLanguageStats()

    const languageStats = {date: DateTime.utc().toISO(), languages: languages }

   await addLanguageStat(languageStats)
      .then(async _ => {
          eventEmitter.emit('add_language_stat_element_sheet', languageStats)
      })
  } catch (error) {
    await insertError({ error: error, date: DateTime.now().toISO(), operation: 'updateLanguageStats' })
  }

}

module.exports = {
  updateLanguageStats
}
