const {insertLog, insertError} = require('../utils/logger')
const {DateTime} = require('luxon')
const {getTwentyFourHours} = require("../service/stat");
const {createStartEndOfDayUtcDateRange} = require("../utils/dates");
const {convertArrayToObject} = require("../utils/list");
const {generateDailyReport} = require("../report/generate_daily_report");
const {addDailyReport} = require("../service/daily_report");
const {addElement, loadDocument} = require("../store/spread_sheet");
const {sheets} = require("../config")


const roundHalfDown = (number) => {
    return -Math.round(-number)
}

const updateDailyReport = async () => {
    console.log(`[${DateTime.now().toUTC()}] Updating daily report.. `)

    try {

        const today = DateTime.utc()
        // const today = DateTime.utc().plus({days: -2})
        const yesterday = today.plus({days: -1})


        const dateRanges = {
            yesterday: createStartEndOfDayUtcDateRange(yesterday),
            today: createStartEndOfDayUtcDateRange(today)
        }

        const list = await getTwentyFourHours(dateRanges)


        if (list) {
            const dateRangesToObject = convertArrayToObject(list)
            const report = await generateDailyReport(dateRangesToObject)

            // await addDailyReport(report)

            report.referenceStats = dateRangesToObject
            console.log(report)


            let obj = {
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

            console.log(obj)
            // const loadDoc = await loadDocument({id: sheets.daily_report_id})


            // console.log(loadDoc)
            // if (loadDoc) {
            //
            //
            //
            //
            //     console.log(obj)
            //     // await addElement({doc: loadDoc, sheetName: 'Report', headersRowIndex: 2, obj:  {
            //     //         "Data": DateTime.fromISO(report.date, {locale: 'es'}).toFormat("dd/MM/yy").toString(),
            //     //         "#Talls": roundHalfDown(report.cuts),
            //     //         "#Talls acumulats AINA": roundHalfDown(report.accumulated_cuts_aina),
            //     //         "#Talls acumulats TOTALS": roundHalfDown(report.total_accumulated_cuts),
            //     //         "#Talls validats": roundHalfDown(report.valid_cuts),
            //     //         "#Talls validats AINA": roundHalfDown(report.valid_cuts_aina),
            //     //         "#Talls validats TOTALS": roundHalfDown(report.total_valid_cuts),
            //     //         "#Hores gravades": roundHalfDown(report.recorded_hours),
            //     //         "#Hores gravades AINA": roundHalfDown(report.recorded_hours_aina),
            //     //         "#Hores TOTALS": roundHalfDown(report.total_hours),
            //     //         "#Hores validades": roundHalfDown(report.valid_hours),
            //     //         "#Hores validades AINA": roundHalfDown(report.valid_hours_aina),
            //     //         "#Hores validades TOTALS": roundHalfDown(report.total_valid_hours),
            //     //         "#Locutors": report.speakers
            //     //     } })
            //
            // }


        }


    } catch (error) {
        console.log(error)
        await insertError(error, 'On update daily report...')
    }

}

updateDailyReport().then(() => {
    console.log('Daily report updated')})

module.exports = {
    updateDailyReport
}
