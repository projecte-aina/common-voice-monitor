const {insertLog, insertError} = require('../utils/logger')
const {DateTime} = require('luxon')
const {getLastReport} = require("../service/daily_report");
const {getLanguageStatsByLanguageCode} = require("../service/language_stat");


const generateDailyReport = async (dateRanges) => {
    console.log(`[${DateTime.now().toUTC()}] Generating daily report... `)

    try {

        const lastReport = await getLastReport()
        const languageStats = await getLanguageStatsByLanguageCode('ca')

        const yesterdayTallsTotals = dateRanges.yesterdayStat.total / 4.6
        const todayTallsTotals = dateRanges.todayStat.total / 4.6
        const cuts = todayTallsTotals - yesterdayTallsTotals


        const yesterdayTallsValid = dateRanges.yesterdayStat.valid / 4.6
        const todayTallsValid = dateRanges.todayStat.valid / 4.6
        const validCuts = todayTallsValid - yesterdayTallsValid

        const yesterdayTotalHours = lastReport.total_hours
        const todayTotalHours = dateRanges.todayStat.total / 3600
        const todayTotalValidHours = dateRanges.todayStat.valid / 3600
        const recordedHours =  yesterdayTotalHours - todayTotalHours
        const validRecordedHours =  lastReport.total_valid_hours - todayTotalValidHours


        return {
            date: DateTime.fromJSDate(dateRanges.yesterdayStat.date).toUTC().startOf('day').toISO(),
            createdAt: DateTime.utc().toISO(),
            cuts: cuts,
            accumulated_cuts_aina: cuts + lastReport.accumulated_cuts_aina,
            total_accumulated_cuts: cuts + lastReport.total_accumulated_cuts,
            valid_cuts: validCuts,
            valid_cuts_aina: validCuts + lastReport.valid_cuts_aina,
            total_valid_cuts: validCuts + lastReport.total_valid_cuts,
            recorded_hours: recordedHours,
            recorded_hours_aina: lastReport.recorded_hours_aina + recordedHours,
            total_hours: todayTotalHours,
            valid_hours: validRecordedHours,
            valid_hours_aina: lastReport.valid_hours_aina + validRecordedHours,
            total_valid_hours: todayTotalValidHours,
            speakers: languageStats.speakers.current_count,
            talls: {talls_ahir: yesterdayTallsTotals, talls_avui: todayTallsTotals}

        }



    } catch (error) {
        console.log(error)
        await insertError(error, 'On generate daily report')

    }

}

module.exports = {
    generateDailyReport,
}
