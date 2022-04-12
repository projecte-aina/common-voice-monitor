const {DateTime} = require('luxon')
const {getLastReport} = require("../service/daily_report");
const {generateSingleSourceOfTruth, generateReport} = require("./helpers");


const generateDailyReport = async () => {
    console.log(`[${DateTime.now().toUTC()}] Generating daily report... `)

    const singleSourceOfTruth = await generateSingleSourceOfTruth(DateTime.utc().minus({days: 1}).startOf('day'), 'ca')
    const lastReport = await getLastReport()

    const expectedLastDate = DateTime.utc().minus({days: 2}).startOf('day')
    const lastReportDate = DateTime.fromJSDate(lastReport.dailyReport.date).toUTC()

    if (lastReportDate.ts !== expectedLastDate.ts) {
        throw new Error(`Last report date is ${lastReport.dailyReport.date} but expected ${expectedLastDate}`)
    }

    const report = await generateReport(singleSourceOfTruth, lastReport.dailyReport)

    return {dailyReport: report, ref: singleSourceOfTruth}
}

module.exports = {
    generateDailyReport,
}
