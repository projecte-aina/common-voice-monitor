const {DateTime} = require("luxon");
const {getLanguageStatNextDayByLocale} = require("../service/language_stat");
const {insertError} = require("../utils/logger");

const generateSingleSourceOfTruth = async (date, locale) => {
    const today = DateTime.utc()

    if (date >= today){
        console.log("cannot calculate stats of today (or the future), they are not yet published")
    }
    else {

        const refLanguageStats = await getLanguageStatNextDayByLocale(locale, date)

        // const refStats = await getStatByDayLatest(date)


        if (refLanguageStats /*&& refStats*/) {
            // const valid = refLanguageStats.info?.seconds
            // const valid = refLanguageStats.info?.validHours * 3600

            const total = refLanguageStats.info?.recordedHours * 3600
            const valid = refLanguageStats.info?.validatedHours * 3600
            const speakers = refLanguageStats.info.speakersCount


            return {
                date: date,
                languageStatsRef: refLanguageStats,
                values: {
                    valid: valid,
                    total: total,
                    speakers: speakers,
                }
            }
        }

        throw new Error("Not enough data to generate single source of truth")

    }

}

const generateReport = async (objRef, lastReport) => {
    console.log(`[${DateTime.now().toUTC()}] Generating daily report... `)

    const seconds_per_cut = 5.592

    let totalAccumulatedCuts, totalValidCuts, totalHours, totalValidHours
    try {

        if (objRef.values.valid / seconds_per_cut === lastReport.total_valid_cuts){

            totalAccumulatedCuts  = objRef.languageStatsRef.total / seconds_per_cut
            totalValidCuts = objRef.languageStatsRef.valid / seconds_per_cut

            totalHours = objRef.languageStatsRef.total / 3600
            totalValidHours = objRef.languageStatsRef.valid / 3600

        }
        else {

            totalAccumulatedCuts  = objRef.values.total / 4.6
            totalValidCuts = objRef.values.valid / 4.6

            totalHours = objRef.values.total / 3600
            totalValidHours = objRef.values.valid / 3600

        }

        const cuts = totalAccumulatedCuts - lastReport.total_accumulated_cuts
        const accumulatedCutsAina = lastReport.accumulated_cuts_aina + cuts

        const validCuts = totalValidCuts - lastReport.total_valid_cuts
        const validCutsAina = lastReport.valid_cuts_aina + validCuts

        const recordedHours = Math.abs(totalHours - lastReport.total_hours)
        const recordedHoursAina = lastReport.recorded_hours_aina + recordedHours

        const validHours = totalValidHours - lastReport.total_valid_hours
        const validHoursAina = lastReport.valid_hours_aina + validHours


        return {
            date: objRef.date.toUTC().startOf('day').toISO(),
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

module.exports = {
    generateSingleSourceOfTruth,
    generateReport
}
