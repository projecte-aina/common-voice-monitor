const { getVoices } = require('../api/commonvoice')
const { addVoices } = require('../service/voice')
const { addElements, loadDocument} = require('../store/spread_sheet')
const { insertLog, insertError } = require('../utils/logger')
const { DateTime } = require('luxon')
const {sheets} = require("../../config");

const updateVoices = async () => {

  console.log(`[${DateTime.now().toUTC()}] Updating voices.. `)

  try {
    const voices = await getVoices()

    voices.splice(-1, 1)

    const results = await addVoices(voices)

    if (results.length > 0) {
      let rows = []
      for (let item of results) {
        rows.push({ data: item.date, veus: item.value })
      }

      const newDoc = await loadDocument({id: sheets.multiple_id})

      await addElements({doc: newDoc, sheetName: 'Veus', rows: rows })

      await insertLog(`${rows.length} voices inserted to google sheet document`)

    }

  } catch (error) {
    await insertError(error, 'On update voices')
  }

}

module.exports = {
  updateVoices
}
