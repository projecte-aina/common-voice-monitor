const fs = require("fs")
const {addDailyReports} = require("../service/daily_report");

const migrateDailyReports = async () => {
    const path = "./dailyreports.json"

    const json = fs.readFileSync(`${path}`)
    const dailyReports = JSON.parse(json)

    await addDailyReports(dailyReports)
        .then(inserted => console.log(`Inserted: ${inserted.length}`))
        .catch(err => console.log(err))
}


migrateDailyReports()
    .then(_ => console.log() )





