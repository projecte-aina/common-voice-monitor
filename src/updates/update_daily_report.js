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
                    "Setmana": Interval.fromDateTimes(DateTime.fromISO(firstWeekDate), DateTime.fromISO(report.dailyReport.date)).count('weeks'),
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
                        "Setmana": Interval.fromDateTimes(DateTime.fromISO(firstWeekDate), DateTime.fromISO(report.dailyReport.date)).count('weeks'),
                        "Data": DateTime.fromISO(report.dailyReport.date, {locale: 'es'}).toFormat("dd/MM/yy").toString(),
                        "#Talls": roundHalfDown(report.dailyReport.cuts),
                        "#Talls acumulats AINA": roundHalfDown(report.dailyReport.accumulated_cuts_aina),
                        "#Talls acumulats TOTALS": roundHalfDown(report.dailyReport.total_accumulated_cuts),
                        "#Talls validats": roundHalfDown(report.dailyReport.valid_cuts),
                        "#Talls validats AINA": roundHalfDown(report.dailyReport.valid_cuts_aina),
                        "#Talls validats TOTALS": roundHalfDown(report.dailyReport.total_valid_cuts),
                        "#Hores gravades": roundHalfDown(report.dailyReport.recorded_hours),
                        "#Hores gravades AINA": roundHalfDown(report.dailyReport.recorded_hours_aina),
                        "#Hores TOTALS": roundHalfDown(report.dailyReport.total_hours),
                        "#Hores validades": roundHalfDown(report.dailyReport.valid_hours),
                        "#Hores validades AINA": roundHalfDown(report.dailyReport.valid_hours_aina),
                        "#Hores validades TOTALS": roundHalfDown(report.dailyReport.total_valid_hours),
                        "#Locutors": report.dailyReport.speakers
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
