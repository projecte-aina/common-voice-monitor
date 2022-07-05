const { DateTime } = require("luxon");

require("../../store/mongo")
const LanguageStat = require("../../models/LanguageStat")
const StatService = require("../../service/stat")
// const fs = require("fs");



const startDate = "2022-06-13T13:58:02.000+00:00";
const endDate = "2022-06-27T12:58:00.000+00:00";



const roundHalfDown = (number) => {
    return -Math.round(-number)
}

const init =  async () => {

    const lStats = await LanguageStat.find({date: {$gte: startDate, $lte: endDate}})

    // let results = []
    for (const lStat of lStats) {

        const utcDate = DateTime.fromJSDate(lStat.date).toUTC();
        const id = lStat.id
        const locale = lStat.launched.find(e => e.locale === 'ca')
        const stats = await StatService.getStatsBetweenDateRange({start: utcDate.startOf('day'), end: utcDate.endOf('day')})

        const statsDates = stats.map(element => new Date(element.date))


        const temp = statsDates.map(d => Math.abs(new Date(utcDate) - new Date(d).getTime()));
        const idx = temp.indexOf(Math.min(...temp));

        const closest = statsDates[idx]

        const stat = stats.find(element => element.date.toString() === closest.toString())

        const fromStats = {recordedHours: roundHalfDown(stat.total / 3600), validatesHours: roundHalfDown(stat.valid / 3600) }

        const result = {id, date: lStat.date, locale, stats, closest: stat, fromStats}

        try {
            await LanguageStat.updateOne({_id: result.id , "launched.locale": 'ca'}, {$set: {"launched.$.recordedHours": fromStats.recordedHours}})
            console.log(`recordedHours from languageStats id=${id} is now set to ${fromStats.recordedHours}`)

        }catch (e) {
            console.log(e)
        }

        // results.push(result)

    }
    // await fs.promises.writeFile('language_stats.json', JSON.stringify(results, null, 2))
    //     .then(() => console.log(`Done..`))
    //     .catch(err => console.log(err))
}

init()

