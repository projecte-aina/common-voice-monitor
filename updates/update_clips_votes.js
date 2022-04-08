const {addElement, loadDocument} = require('../store/spread_sheet')
const {insertLog, insertError} = require('../utils/logger')
const {DateTime} = require('luxon')
const {getClipsVotes} = require('../api/commonvoice')
const {addClipVote} = require('../service/clip_votes')
const {sheets} = require("../config");


const updateClipsVotes = async () => {
    console.log(`[${DateTime.now().toUTC()}] Updating clips/votes.. `)

    try {
        const clipsVotes = await getClipsVotes()


        const clipVote = await addClipVote({
            clipsCount: clipsVotes.clipsDailyCount,
            votesCount: clipsVotes.clipsVotesDailyCount
        })

        if (clipVote) {

            const newDoc = await loadDocument({id: sheets.multiple_id})

            await addElement({
                doc: newDoc,
                sheetName: 'Clips Vots',
                obj: {data: clipVote.date, clips: clipVote.clips, vots: clipVote.votes}
            })
            await insertLog(`Clip Votes inserted to google sheet document`)
        }

    } catch (error) {
        await insertError(error, 'On update Clip/Votes')
    }

}


module.exports = {
    updateClipsVotes
}