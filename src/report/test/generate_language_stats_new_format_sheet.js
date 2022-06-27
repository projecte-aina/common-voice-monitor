const fs = require("fs")

const EventEmitter = require('events');


const {loadDocument, addElements} = require("../../store/spread_sheet");
const {sheets} = require("../../../config");

const eventEmitter = new EventEmitter();

const doc = loadDocument({id: sheets.multiple_id})

eventEmitter.on('add_language_stats_elements_sheet', async (languageStatsList) => {

    const lMap = languageStatsList.map(item => {
        const element = item['launched'].find(e => e.locale === 'ca')
        return {
            data: item.date.$date,
            'hores gravades': element.recordedHours,
            'hores valides': element.validatedHours,
            parlants: element.speakersCount,
            frases: element.sentencesCount.currentCount
        }
    })

    // console.log(lMap)

    await addElements({doc: doc, sheetName: 'Total', rows: lMap})

});


const generate_language_stats_new_format_sheet = () => {


    const path = "./languagestats_fix.json"

    const json = fs.readFileSync(`${path}`)

    const languageStats = JSON.parse(json)

    eventEmitter.emit('add_language_stats_elements_sheet', languageStats);

}

generate_language_stats_new_format_sheet()
