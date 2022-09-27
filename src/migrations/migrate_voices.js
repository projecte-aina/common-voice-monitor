const fs = require("fs")

const {addVoices} = require("../service/voice");


const migrate_language_stats = () => {
    const path = "/home/andrei/Downloads/cv_monitor_20220923_20220925/pending/voices"

    fs.readdir(path, async (err, files) => {
        if (err) {
            throw err;
        }

        for (const file of files) {

            try {
                const filePath = `${path}/${file}`

                const json = fs.readFileSync(filePath)

                const voices = JSON.parse(json)

                addVoices(voices)
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
