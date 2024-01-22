const {insertLog, insertError} = require('../utils/logger')
const {DateTime, Interval} = require('luxon')
const {generateDailyReport, generateDailyReportsOverdue} = require("../report/generate_daily_report");
const {addDailyReport} = require("../service/daily_report");
const {addElement, loadDocument, addElements} = require("../store/spread_sheet");
const {sheets, firstWeekDate} = require("../../config")


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
                    "Week": Interval.fromDateTimes(DateTime.fromISO(firstWeekDate), DateTime.fromISO(report.dailyReport.date)).count('weeks'),
                    "Date": DateTime.fromJSDate(inserted.dailyReport.date, {locale: 'es'}).toFormat("dd/MM/yy").toString(),
                    "#Cuts": roundHalfDown(inserted.dailyReport.cuts),
                    "#PROJECT Accumulated cuts": roundHalfDown(inserted.dailyReport.accumulated_cuts_aina),
                    "#TOTAL Accumulated cuts": roundHalfDown(inserted.dailyReport.total_accumulated_cuts),
                    "#Validated cuts": roundHalfDown(inserted.dailyReport.valid_cuts),
                    "#PROJECT Validated cuts": roundHalfDown(inserted.dailyReport.valid_cuts_aina),
                    "#TOTAL Validated cuts": roundHalfDown(inserted.dailyReport.total_valid_cuts),
                    "#Recorded hours": roundHalfDown(inserted.dailyReport.recorded_hours),
                    "#PROJECT Recorded hours": roundHalfDown(inserted.dailyReport.recorded_hours_aina),
                    "#TOTAL hours": roundHalfDown(inserted.dailyReport.total_hours),
                    "#Validated hours": roundHalfDown(inserted.dailyReport.valid_hours),
                    "#PROJECT Validated hours": roundHalfDown(inserted.dailyReport.valid_hours_aina),
                    "#TOTAL Validated hours": roundHalfDown(inserted.dailyReport.total_valid_hours),
                    "#Speakers": inserted.dailyReport.speakers
                }})
            await insertLog(`Add daily report to google sheet document`)
        }).catch(async (error) => {
            await insertError(error, 'On update daily report...')
        })
}


const updateDailyReportsOverdue = async () => {
    console.log(`[${DateTime.now().toUTC()}] Updating daily reports overdue.. `)

    await generateDailyReportsOverdue()
          .then(async (reports) => {

            for (const report of reports) {
                await addDailyReport(report)
            }

            const loadDoc = await loadDocument({id: sheets.daily_report_id})

            if (loadDoc) {
        
                const reportRows = reports.map(report => {
                    return {
                        "Week": Interval.fromDateTimes(DateTime.fromISO(firstWeekDate), DateTime.fromISO(report.dailyReport.date)).count('weeks'),
                        "Date": DateTime.fromJSDate(inserted.dailyReport.date, {locale: 'es'}).toFormat("dd/MM/yy").toString(),
                        "#Cuts": roundHalfDown(inserted.dailyReport.cuts),
                        "#PROJECT Accumulated cuts": roundHalfDown(inserted.dailyReport.accumulated_cuts_aina),
                        "#TOTAL Accumulated cuts": roundHalfDown(inserted.dailyReport.total_accumulated_cuts),
                        "#Validated cuts": roundHalfDown(inserted.dailyReport.valid_cuts),
                        "#PROJECT Validated cuts": roundHalfDown(inserted.dailyReport.valid_cuts_aina),
                        "#TOTAL Validated cuts": roundHalfDown(inserted.dailyReport.total_valid_cuts),
                        "#Recorded hours": roundHalfDown(inserted.dailyReport.recorded_hours),
                        "#PROJECT Recorded hours": roundHalfDown(inserted.dailyReport.recorded_hours_aina),
                        "#TOTAL hours": roundHalfDown(inserted.dailyReport.total_hours),
                        "#Validated hours": roundHalfDown(inserted.dailyReport.valid_hours),
                        "#PROJECT Validated hours": roundHalfDown(inserted.dailyReport.valid_hours_aina),
                        "#TOTAL Validated hours": roundHalfDown(inserted.dailyReport.total_valid_hours),
                        "#Speakers": inserted.dailyReport.speakers
                    }
                })
        
                try {
                    await addElements({doc: loadDoc, sheetName: 'Report', headersRowIndex: 2, rows: reportRows})
                    await insertLog(`Add daily reports overdue to google sheet document`)
                }catch (error) {
                    await insertError(error, 'On update daily report overdue, adding elements to google sheet...')
                }
            }
          }).catch(async (error) => {
                    await insertError(error, 'On update daily reports overdue...')
        })
}
module.exports = {
    updateDailyReport,
    updateDailyReportsOverdue
}
