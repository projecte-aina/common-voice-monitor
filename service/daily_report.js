require("../store/mongo")
const DailyReport = require("../models/DailyReport")
const {insertError} = require('../utils/logger')
const {getIsoDateFromFormat} = require("../utils/dates");


const addDailyReports = async (reports) => {

    let inserted = []

    for (const report of reports) {

        if (!report.date) {
            throw Error("Item date not available...")
        }

        const reportDate = report.date

        report.date = getIsoDateFromFormat(reportDate, "dd/MM/yyyy")


        const dailyReport = new DailyReport(report)

        try {
            await dailyReport.save()
            inserted.push(dailyReport)
        } catch (e) {
            console.log(e)
            await insertError(e, "On save daily report")
        }
    }

    return inserted
}

const addDailyReport = async (report) => {

    let inserted = null
    const dailyReport = new DailyReport(report)

    try {
       inserted =  await dailyReport.save()
    } catch (error) {
        await insertError(error, "On save daily report")
    }


    if (!inserted) {
        throw Error("Not able to save daily report...")
    }

    return inserted
}

const getLastReport = async () => {
    const report = await DailyReport.findOne({})
        .sort({date: -1})

    if (!report) {
        throw Error("Not report available")
    }
    return report
}
module.exports = {
    addDailyReport,
    addDailyReports,
    getLastReport
}