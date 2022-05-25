const {DateTime, Interval} = require('luxon');
const fs = require("fs");
const {loadDocument, addElements} = require("../../store/spread_sheet");
const {sheets, firstWeekDate} = require("../../../config");
const {generateSingleSourceOfTruth, generateReport} = require("../helpers");
const {addDailyReport} = require("../../service/daily_report");



const roundHalfDown = (number) => {
    return -Math.round(-number)
}


const generate_reports = async () => {


    let reports = [
        {dailyReport: {
                "date": "2022-05-22T00:00:00.000+00:00",
                "cuts":1622.19768979121,
                "accumulated_cuts_aina":887812.088404862,
                "total_accumulated_cuts":1771120.088404862,
                "valid_cuts":1341.9565217391355,
                "valid_cuts_aina":250544.3913043479,
                "total_valid_cuts":995497.3913043479,
                "recorded_hours":2.0728081591773844,
                "recorded_hours_aina":1227.0978907395456,
                "total_hours":2263.0978907395456,
                "valid_hours":1.7147222222222354,
                "valid_hours_aina":356.0244444444445,
                "total_valid_hours":1272.0244444444445,
                "speakers":28053}
        }
    ]

    const startDate = "2022-05-23T00:00:00.000+00:00";
    const endDate = "2022-05-24T00:00:00.000+00:00";
    // loop from start date to end date

    const startDateTime = DateTime.fromISO(startDate).toUTC();
    const endDateTime = DateTime.fromISO(endDate).toUTC();


    for (let i = startDateTime; i <= endDateTime; i = i.plus({days: 1})) {
        console.log(i.toISO())


        const singleSourceOfTruth = await generateSingleSourceOfTruth(i, 'ca')
        const report = await generateReport(singleSourceOfTruth, reports[reports.length - 1].dailyReport)

        reports.push({dailyReport: report, ref: singleSourceOfTruth})


    }

    await fs.promises.writeFile('./reports.json', JSON.stringify(reports, null, 4))


    reports.shift()

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

        await addElements({doc: loadDoc, sheetName: 'Report', headersRowIndex: 2, rows: reportRows})
    }

}


generate_reports().then(_ => console.log("done"));
