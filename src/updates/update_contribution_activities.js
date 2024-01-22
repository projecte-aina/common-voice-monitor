const { getContributionActivities } = require('../api/commonvoice')
const { addElements, loadDocument} = require('../store/spread_sheet')
const { insertLog, insertError } = require('../utils/logger')
const { addContributionActivities } = require('../service/contribution_activity')
const { DateTime } = require('luxon')
const {sheets} = require("../../config");


const updateContributionActivities = async () => {
  console.log(`[${DateTime.now().toUTC()}] Updating contribution activities.. `)

  try {
    const contributionActivities = await getContributionActivities()

    contributionActivities.splice(-1, 1)

    const results = await addContributionActivities(contributionActivities)

    if (results.length > 0) {

      let rows = []
      for (let item of results) {
        rows.push({ date: item.date, contributions: item.value })
      }
      const newDoc = await loadDocument({id: sheets.multiple_id})

      await addElements({doc: newDoc, sheetName: 'Contributions', rows: rows})

      await insertLog(`${rows.length} contributions activities inserted to google sheet document`)

    }

  } catch (error) {
    await insertError(error, 'On update contribution activities')
  }

}

// ;(async () => {
//   await updateContributionActivities()
// })()

module.exports = {
  updateContributionActivities
}
