const {DateTime, Interval} = require('luxon');
const fs = require("fs");
const {loadDocument, addElements} = require("../../store/spread_sheet");
const {sheets, firstWeekDate} = require("../../../config");
const {generateSingleSourceOfTruth, generateReport} = require("../helpers");
const {addDailyReport} = require("../../service/daily_report");
// const {addDailyReport} = require("../../service/daily_report");



const roundHalfDown = (number) => {
    return -Math.round(-number)
}


const generate_reports = async () => {


    let reports = [
        { "dailyReport": {
            "date": "2023-10-27T00:00:00.000Z",
            "cuts": 2347.826086956542,
            "accumulated_cuts_aina": 1927822.4347826089,
            "total_accumulated_cuts": 2811130.434782609,
            "valid_cuts": 782.608695652103,
            "valid_cuts_aina": 1346177.4347826089,
            "total_valid_cuts": 2091130.4347826089,
            "recorded_hours": 3,
            "recorded_hours_aina": 2556,
            "total_hours": 3592,
            "valid_hours": 1,
            "valid_hours_aina": 1756,
            "total_valid_hours": 2672,
            "speakers": 35425
          }}
        
    ]

    const startDate = "2023-10-28T00:00:00.000+00:00";
    const endDate = "2023-11-21T00:00:00.000+00:00";
    // loop from start date to end date

    const startDateTime = DateTime.fromISO(startDate).toUTC();
    const endDateTime = DateTime.fromISO(endDate).toUTC();


    for (let i = startDateTime; i <= endDateTime; i = i.plus({days: 1})) {
        console.log(i.toISO())


        const singleSourceOfTruth = await generateSingleSourceOfTruth(i, 'ca')
        const report = await generateReport(singleSourceOfTruth, reports[reports.length - 1].dailyReport)

        reports.push({dailyReport: report, ref: singleSourceOfTruth})


    }

    reports.shift()

    // await fs.promises.writeFile('./reports_29092023.json', JSON.stringify(reports, null, 4))

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

        }catch (e) {
            console.log(`Error`)
        }
    }

}


generate_reports();
