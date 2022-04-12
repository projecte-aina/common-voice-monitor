const {DateTime} = require('luxon');
const fs = require("fs");
const {loadDocument, addElements} = require("../../store/spread_sheet");
const {sheets} = require("../../config");
const {generateSingleSourceOfTruth, generateReport} = require("../helpers");
const {addDailyReport} = require("../../service/daily_report");



const roundHalfDown = (number) => {
    return -Math.round(-number)
}


const generate_reports = async () => {


    let reports = [
        {dailyReport: {
            "date": "2022-02-25T00:00:00.000+00:00",
            "cuts": 20648,
            "accumulated_cuts_aina": 314635,
            "total_accumulated_cuts": 1197943,
            "valid_cuts": 4426,
            "valid_cuts_aina": 71891,
            "total_valid_cuts": 816844,
            "recorded_hours": 26,
            "recorded_hours_aina": 494,
            "total_hours": 1530,
            "valid_hours": 5,
            "valid_hours_aina": 127,
            "total_valid_hours": 1043,
            "speakers": 20244}
        }
    ]

    const startDate = "2022-02-26T00:00:00.000+00:00";
    const endDate = "2022-04-11T00:00:00.000+00:00";
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

    for (const report of reports) {
        await addDailyReport(report)
    }

    reports.shift()

    const loadDoc = await loadDocument({id: sheets.daily_report_id})

    if (loadDoc) {

       const reportRows = reports.map(report => {
           return {
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

        await addElements({doc: loadDoc, sheetName: 'Report Test Complete', headersRowIndex: 2, rows: reportRows})
    }

}


generate_reports().then(_ => console.log("done"));
