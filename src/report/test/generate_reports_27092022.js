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
        {dailyReport:{
            "date": "2022-09-22T00:00:00.000+00:00",
            "cuts": 1565.217391304206,
            "accumulated_cuts_aina": 1183561.5652173914,
            "total_accumulated_cuts": 2066869.5652173914,
            "valid_cuts": 3130.434782608645,
            "valid_cuts_aina": 558090.4782608696,
            "total_valid_cuts": 1303043.4782608696,
            "recorded_hours": 2,
            "recorded_hours_aina": 1605,
            "total_hours": 2641,
            "valid_hours": 4,
            "valid_hours_aina": 749,
            "total_valid_hours": 1665,
            "speakers": 30438}
        }
    ]

    const startDate = "2022-09-23T00:00:00.000+00:00";
    const endDate = "2022-09-26T00:00:00.000+00:00";
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

    await fs.promises.writeFile('./reports_27092022.json', JSON.stringify(reports, null, 4))

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
