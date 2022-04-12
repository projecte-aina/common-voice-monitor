const {insertLog, insertError} = require('../utils/logger')
const {DateTime} = require('luxon')
const {generateDailyReport} = require("../report/generate_daily_report");
const {addDailyReport} = require("../service/daily_report");
const {addElement, loadDocument} = require("../store/spread_sheet");
const {sheets} = require("../config")


const roundHalfDown = (number) => {
    return -Math.round(-number)
}

const updateDailyReport = async () => {
    console.log(`[${DateTime.now().toUTC()}] Updating daily report.. `)

    await generateDailyReport()
        .then(async (report) => {

            const inserted = await addDailyReport(report)
            const loadDoc = await loadDocument({id: sheets.daily_report_id})

            await addElement({doc: loadDoc, headersRowIndex: 2, sheetName: 'Report', obj: {
                    "Data": DateTime.fromJSDate(inserted.dailyReport.date, {locale: 'es'}).toFormat("dd/MM/yy").toString(),
                    "#Talls": roundHalfDown(inserted.dailyReport.cuts),
                    "#Talls acumulats AINA": roundHalfDown(inserted.dailyReport.accumulated_cuts_aina),
                    "#Talls acumulats TOTALS": roundHalfDown(inserted.dailyReport.total_accumulated_cuts),
                    "#Talls validats": roundHalfDown(inserted.dailyReport.valid_cuts),
                    "#Talls validats AINA": roundHalfDown(inserted.dailyReport.valid_cuts_aina),
                    "#Talls validats TOTALS": roundHalfDown(inserted.dailyReport.total_valid_cuts),
                    "#Hores gravades": roundHalfDown(inserted.dailyReport.recorded_hours),
                    "#Hores gravades AINA": roundHalfDown(inserted.dailyReport.recorded_hours_aina),
                    "#Hores TOTALS": roundHalfDown(inserted.dailyReport.total_hours),
                    "#Hores validades": roundHalfDown(inserted.dailyReport.valid_hours),
                    "#Hores validades AINA": roundHalfDown(inserted.dailyReport.valid_hours_aina),
                    "#Hores validades TOTALS": roundHalfDown(inserted.dailyReport.total_valid_hours),
                    "#Locutors": inserted.dailyReport.speakers
                }})
            await insertLog(`Add daily report to google sheet document`)
        }).catch(async (error) => {
            await insertError(error, 'On update daily report...')
        })
}

module.exports = {
    updateDailyReport
}
