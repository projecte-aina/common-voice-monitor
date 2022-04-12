const fs = require("fs")
const {addStats} = require("../service/stat");

const migrate_stats = () => {
    const path = "C:/Users/bscuser/Desktop/202202/stats"

    fs.readdir(path, async (err, files) => {
        if (err) {
            throw err;
        }

        for (const file of files) {
            console.log(file);
            const json = fs.readFileSync(`${path}/${file}`)
            const stats = JSON.parse(json)

            await addStats(stats)
                .then(inserted => console.log(`Inserted: ${inserted.length}`))
                .catch(err => console.log(err))
        }
    });

}

migrate_stats()





