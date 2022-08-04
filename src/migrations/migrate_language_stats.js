const fs = require("fs")

const {addLanguageStat} = require("../service/language_stat");



const {DateTime} = require('luxon')


const migrate_language_stats = () => {
    const path = "/home/andrei/Downloads/migrated/202202/lang"

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


                await addLanguageStat(languageStats)
                    .then(() => {
                        console.log(`Saved ${file} to db...`)
                    }).catch(error => console.log(error))
            }catch (error) {
                console.log(`${error} on file ${file}`)
            }



        }

    });

}

migrate_language_stats()
