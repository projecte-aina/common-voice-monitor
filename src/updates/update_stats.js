const { getStats } = require('../api/commonvoice')
const { addStats } = require('../service/stat')
const { addElement, loadDocument} = require('../store/spread_sheet')
const { insertLog, insertError } = require('../utils/logger')
const { DateTime } = require('luxon')
const {sheets} = require("../config");


const updateStats = async () => {
  console.log(`[${DateTime.now().toUTC()}] Updating stats.. `)

  try {
    const stats = await getStats()
    const results = await addStats(stats)

    if (results.length > 0) {
      let rows = []
      for (let item of results) {
        rows.push({ data: item.date, total: item.total, valides: item.valid })
      }

      // const todayRows = rows.filter(e => DateTime.fromJSDate(e.data).month === DateTime.now().month
      //   && DateTime.fromJSDate(e.data).year === DateTime.now().year )

      const newDoc = await loadDocument({id: sheets.multiple_id})

      await addElement({doc: newDoc, sheetName: 'Stats', obj: rows[rows.length-1] })

      await insertLog(`Today stats inserted to google sheet document`)
    }

  } catch (error) {
    await insertError(error, 'On update stats')
  }

}

module.exports = {
  updateStats
}