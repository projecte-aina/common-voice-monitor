const { getLanguageStats } = require('../api/commonvoice')
const { DateTime } = require('luxon')
const { addLanguageStat } = require('../service/language_stat')
const { addElement, loadDocument} = require('../store/spread_sheet')
const { insertLog, insertError } = require('../utils/logger')
const {sheets} = require("../config");

const updateLanguageStats = async () => {

  try {
    console.log(`[${DateTime.now().toUTC()}] Updating language stats..`)

    const languageStats = await getLanguageStats()

    const isoDate = DateTime.utc().toISO()
    const element = languageStats['launched'].find(e => e.locale === 'ca')
    const forSheet = { data: isoDate, segons: element.seconds, parlants: element.speakers.current_count }

    languageStats.date = isoDate

   await addLanguageStat(languageStats)
      .then(async _ => {

        const newDoc = await loadDocument({id: sheets.multiple_id})

        await addElement({doc: newDoc, sheetName: 'Total', obj: forSheet})
        await insertLog(`Updated language stats inserted to google sheet document`)

      })
  } catch (error) {
    await insertError({ error: error, date: DateTime.now().toISO(), operation: 'updateLanguageStats' })

  }

}
module.exports = {
  updateLanguageStats
}