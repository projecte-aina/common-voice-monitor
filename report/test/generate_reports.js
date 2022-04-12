const {DateTime} = require('luxon');
const {getStatByDayLatest} = require("../../service/stat");
const {getLastReport} = require("../../service/daily_report");
const {getLanguageStatNextDayByLocale
} = require("../../service/language_stat");
const {insertError} = require("../../utils/logger");
const fs = require("fs");
const {loadDocument, addElements} = require("../../store/spread_sheet");
const {sheets} = require("../../config");



const roundHalfDown = (number) => {
    return -Math.round(-number)
}

const generateReport = async (objRef, lastReport) => {
    console.log(`[${DateTime.now().toUTC()}] Generating daily report... `)

    try {

        const totalAccumulatedCuts  = objRef.values.total / 4.6
        const totalValidCuts = objRef.values.valid / 4.6

        const totalHours = objRef.values.total / 3600
        const totalValidHours = objRef.values.valid / 3600

        const cuts = totalAccumulatedCuts - lastReport.total_accumulated_cuts
        const accumulatedCutsAina = lastReport.accumulated_cuts_aina + cuts

        const validCuts = totalValidCuts - lastReport.total_valid_cuts
        const validCutsAina = lastReport.valid_cuts_aina + validCuts

        const recordedHours = Math.abs(totalHours - lastReport.total_hours)
        const recordedHoursAina = lastReport.recorded_hours_aina + recordedHours

        const validHours = totalValidHours - lastReport.total_valid_hours
        const validHoursAina = lastReport.valid_hours_aina + validHours


        return {
            date: DateTime.fromJSDate(objRef.statsRef.date).toUTC().startOf('day').toISO(),
            createdAt: DateTime.utc().toISO(),
            cuts: cuts,
            accumulated_cuts_aina: accumulatedCutsAina,
            total_accumulated_cuts: totalAccumulatedCuts,
            valid_cuts: validCuts,
            valid_cuts_aina: validCutsAina,
            total_valid_cuts: totalValidCuts,
            recorded_hours: recordedHours,
            recorded_hours_aina: recordedHoursAina,
            total_hours: totalHours,
            valid_hours: validHours,
            valid_hours_aina: validHoursAina,
            total_valid_hours: totalValidHours,
            speakers: objRef.values.speakers,
        }



    } catch (error) {
        console.log(error)
        await insertError(error, 'On generate daily report')

    }

}

const generateSingleSourceOfTruth = async (date, locale) => {
    const today = DateTime.utc()

    if (date >= today){
        console.log("cannot calculate stats of today (or the future), they are not yet published")
    }
    else {

        const refLanguageStats = await getLanguageStatNextDayByLocale(locale, date)

        const refStats = await getStatByDayLatest(date)


        if (refLanguageStats && refStats) {
            const refFraction = refStats.total / refStats.valid

            const valid = refLanguageStats.info?.seconds
            const speakers = refLanguageStats.info.speakers.current_count || refLanguageStats.info.speakers
            const total = valid * refFraction


            return {
                statsRef: refStats,
                languageStatsRef: refLanguageStats,
                values: {
                    valid: valid,
                    total: total,
                    speakers: speakers,
                }
            }
        }

        throw new Error("Not enough data to generate single source of truth")

        // console.log(JSON.stringify(obj, null, 2))

    }

}


const generate_reports = async () => {


    let reports = [
        {dailyReport: {
            "date": "25/02/2022",
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
    const endDate = "2022-04-05T00:00:00.000+00:00";
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
