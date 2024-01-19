const {DateTime} = require('luxon')
const {getLastReport} = require("../service/daily_report");
const {generateSingleSourceOfTruth, generateReport} = require("./helpers");


const generateDailyReport = async () => {
    console.log(`[${DateTime.now().toUTC()}] Generating daily report... `)

    const singleSourceOfTruth = await generateSingleSourceOfTruth(DateTime.utc().minus({days: 1}).startOf('day'),  process.env.LOCALE)
    const lastReport = await getLastReport()

    const expectedLastDate = DateTime.utc().minus({days: 2}).startOf('day')
    const lastReportDate = DateTime.fromJSDate(lastReport.dailyReport.date).toUTC()

    if (lastReportDate.ts !== expectedLastDate.ts) {
        throw new Error(`Last report date is ${lastReport.dailyReport.date} but expected ${expectedLastDate}`)
    }

    const report = await generateReport(singleSourceOfTruth, lastReport.dailyReport)

    return {dailyReport: report, ref: singleSourceOfTruth}
}

const generateDailyReportsOverdue = async () => {
    console.log(`[${DateTime.now().toUTC()}] Generating daily reports overdue... `)

    const lastReport = await getLastReport()
    const lastReportDate = DateTime.fromJSDate(lastReport.dailyReport.date).toUTC()

    const expectedLastDate = DateTime.utc().minus({days: 1}).startOf('day')
    const firstReportDate = lastReportDate.plus({days: 1}).startOf('day')

    if (lastReportDate.ts === expectedLastDate.ts) {
        throw new Error(`Operation aborted`)
    }

    let reports = []
    reports[0] = lastReport

    for (let i = firstReportDate; i <= expectedLastDate; i = i.plus({days: 1})) {

        const singleSourceOfTruth = await generateSingleSourceOfTruth(i, process.env.LOCALE)
        const report = await generateReport(singleSourceOfTruth, reports[reports.length - 1].dailyReport)

        reports.push({dailyReport: report, ref: singleSourceOfTruth})

    }

    reports.shift()
    
    return reports

}

module.exports = {
    generateDailyReport,
    generateDailyReportsOverdue
}
