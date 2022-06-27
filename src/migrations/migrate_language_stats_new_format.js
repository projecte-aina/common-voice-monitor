const fs = require("fs")

const {addLanguageStat} = require("../service/language_stat");
const EventEmitter = require('events');


const {DateTime} = require('luxon')
const {loadDocument, addElement, addElements} = require("../store/spread_sheet");
const {sheets} = require("../../config");
const {insertLog} = require("../utils/logger");

const eventEmitter = new EventEmitter();

const doc = loadDocument({id: sheets.multiple_id})

eventEmitter.on('add_language_stats_elements_sheet', async (languageStatsList) => {

    const lMap = languageStatsList.map(item => {
       const element = item['launched'].find(e => e.locale === 'ca')
        return {
           data: item.date,
           'hores gravades': element.recordedHours,
           'hores valides': element.validatedHours,
           parlants: element.speakersCount,
           frases: element.sentencesCount.currentCount
       }
    })

    await addElements({doc: doc, sheetName: 'Total', rows: lMap})

    // await addElement({doc: doc, sheetName: 'Total', obj: forSheet})
    await insertLog(`Updated language stats inserted to google sheet document`)
});


const migrate_language_stats_new_format = () => {
    const path = "/home/andrei/Downloads/language_stats/new_format"

    let languageStatsList = []

    fs.readdir(path, async (err, files) => {
        if (err) {
            throw err;
        }

        for (const file of files) {


            try {
                const filePath = `${path}/${file}`
                const stats = await fs.promises.stat(filePath)

                const cDate = DateTime.fromJSDate(stats.mtime)

                const isoDate = cDate.toUTC().toISO()

                const json = fs.readFileSync(filePath)

                const languageStats = JSON.parse(json)

                languageStats.date = isoDate


                languageStatsList.push(languageStats)

                // await addLanguageStat(languageStats)
                //     .then(() => {
                //         console.log(`Saved ${file} to db...`)
                //         languageStatsList.push(languageStats)
                //     })
            }catch (error) {
                console.log(`${error} on file ${file}`)
            }



        }

        eventEmitter.emit('add_language_stats_elements_sheet', languageStatsList);

    });

}

migrate_language_stats_new_format()
