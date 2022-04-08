const {DateTime} = require('luxon');
const {createStartEndOfDayUtcDateRange} = require("../../utils/dates");
const {getTwentyFourHours} = require("../../service/stat");
const {convertArrayToObject} = require("../../utils/list");
const {getLastReport} = require("../../service/daily_report");
const {getLanguageStatsByLanguageCode} = require("../../service/language_stat");
const {insertError} = require("../../utils/logger");
const fs = require("fs");
const {loadDocument, addElements} = require("../../store/spread_sheet");
const {sheets} = require("../../config");



const roundHalfDown = (number) => {
    return -Math.round(-number)
}

const generateReport = async (dateRanges) => {
    console.log(`[${DateTime.now().toUTC()}] Generating daily report... `)

    try {

        // const lastReport = await getLastReport()
        // const languageStats = await getLanguageStatsByLanguageCode('ca')

        const yesterdayTallsTotals = dateRanges.yesterdayStat.total / 4.6
        const todayTallsTotals = dateRanges.todayStat.total / 4.6
        const cuts = todayTallsTotals - yesterdayTallsTotals


        const yesterdayTallsValid = dateRanges.yesterdayStat.valid / 4.6
        const todayTallsValid = dateRanges.todayStat.valid / 4.6
        const validCuts = Math.abs(todayTallsValid - yesterdayTallsValid)

        // const yesterdayTotalHours = lastReport.total_hours


        const todayTotalHours = dateRanges.todayStat.total / 3600
        const todayTotalValidHours = dateRanges.todayStat.valid / 3600
        const yesterdayValidHours = dateRanges.yesterdayStat.valid / 3600

        const yesterdayTotalHours = dateRanges.yesterdayStat.total / 3600
        const recordedHours =  Math.abs(todayTotalHours - yesterdayTotalHours )
        const validRecordedHours =  Math.abs(todayTotalValidHours - yesterdayValidHours)

        return {
            date: DateTime.fromJSDate(dateRanges.yesterdayStat.date).toUTC().startOf('day').toISO(),
            createdAt: DateTime.utc().toISO(),
            cuts: cuts,
            // accumulated_cuts_aina: cuts + lastReport.accumulated_cuts_aina,
            // total_accumulated_cuts: cuts + lastReport.total_accumulated_cuts,
            valid_cuts: validCuts,
            // valid_cuts_aina: validCuts + lastReport.valid_cuts_aina,
            // total_valid_cuts: validCuts + lastReport.total_valid_cuts,
            recorded_hours: recordedHours,
            // recorded_hours_aina: lastReport.recorded_hours_aina + recordedHours,
            // total_hours: todayTotalHours,
            valid_hours: validRecordedHours,
            // valid_hours_aina: lastReport.valid_hours_aina + validRecordedHours,
            // total_valid_hours: todayTotalValidHours,
            // speakers: languageStats.speakers.current_count,
            referenceStats: dateRanges,

        }



    } catch (error) {
        console.log(error)
        await insertError(error, 'On generate daily report')

    }

}

const generate_reports = async () => {


    // let reports = [{
    //     "date": "29/03/2022",
    //     "cuts": 3774,
    //     "accumulated_cuts_aina": 637710,
    //     "total_accumulated_cuts": 1521018,
    //     "valid_cuts": 1710,
    //     "valid_cuts_aina": 152688,
    //     "total_valid_cuts": 897641,
    //     "recorded_hours": 7,
    //     "recorded_hours_aina": 904,
    //     "total_hours": 1940,
    //     "valid_hours": 2,
    //     "valid_hours_aina": 229,
    //     "total_valid_hours": 1145,
    //     "speakers": 25412
    // }]

    let reports = []

    const startDate = "2022-03-31T00:00:00.000+00:00";
    const endDate = "2022-04-05T00:00:00.000+00:00";
    // loop from start date to end date

    const startDateTime = DateTime.fromISO(startDate).toUTC();
    const endDateTime = DateTime.fromISO(endDate).toUTC();


    for (let i = startDateTime; i <= endDateTime; i = i.plus({days: 1})) {
        console.log(i.toISO())

        const today = i.toUTC();
        const yesterday = i.plus({days: -1}).toUTC();

        const dateRanges = {
            yesterday: createStartEndOfDayUtcDateRange(yesterday),
            today: createStartEndOfDayUtcDateRange(today)
        }

        const list = await getTwentyFourHours(dateRanges)

        if (list) {
            let report = {}
            const dateRangesToObject = convertArrayToObject(list)

            report = await generateReport(dateRangesToObject)
            reports.push(report)

        }

    }

    const loadDoc = await loadDocument({id: sheets.daily_report_id})

    if (loadDoc) {

       const reportRows = reports.map(report => {
           return {
               "Data": DateTime.fromISO(report.date, {locale: 'es'}).toFormat("dd/MM/yy").toString(),
               "#Talls": roundHalfDown(report.cuts),
               "#Talls acumulats AINA": roundHalfDown(report.accumulated_cuts_aina),
               "#Talls acumulats TOTALS": roundHalfDown(report.total_accumulated_cuts),
               "#Talls validats": roundHalfDown(report.valid_cuts),
               "#Talls validats AINA": roundHalfDown(report.valid_cuts_aina),
               "#Talls validats TOTALS": roundHalfDown(report.total_valid_cuts),
               "#Hores gravades": roundHalfDown(report.recorded_hours),
               "#Hores gravades AINA": roundHalfDown(report.recorded_hours_aina),
               "#Hores TOTALS": roundHalfDown(report.total_hours),
               "#Hores validades": roundHalfDown(report.valid_hours),
               "#Hores validades AINA": roundHalfDown(report.valid_hours_aina),
               "#Hores validades TOTALS": roundHalfDown(report.total_valid_hours),
               "#Locutors": report.speakers
           }
       })

        await addElements({doc: loadDoc, sheetName: 'Report Test', headersRowIndex: 2, rows: reportRows})


    }




    await fs.promises.writeFile('./reports.json', JSON.stringify(reports, null, 2))
    // console.log( DateTime.fromISO(startDate).toUTC().toISO() );


}


generate_reports().then(_ => console.log("done"));
