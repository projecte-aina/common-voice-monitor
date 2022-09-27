const fs = require("fs")
const {addStats} = require("../service/stat");

const migrate_stats = () => {
    const path = "/home/andrei/Downloads/cv_monitor_20220923_20220925/pending/stats"

    fs.readdir(path, async (err, files) => {
        if (err) {
            throw err;
        }

        for (const file of files) {
            console.log(file);
            const json = fs.readFileSync(`${path}/${file}`)

            try {
                const stats = JSON.parse(json)
                await addStats(stats)
                    .then(inserted => console.log(`Inserted: ${inserted.length}`))
                    .catch(err => console.log(err))
            } catch (err) {
                console.log('error', err);
            }


        }
    });

}

migrate_stats()





