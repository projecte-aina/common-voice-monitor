const { endpoints } = require('../../config.js')
const axios = require('axios')

const getLanguageStats = () => new Promise((resolve, reject) => {

  axios.get(endpoints.language_stats)
    .then(response => {
      resolve(response.data)
    })
    .catch(err => reject(err))
})

const getVoices = () => {
  return new Promise((resolve, reject) => {

    // fs.promises.readFile("voices.json")
    //   .then(result => resolve(JSON.parse(result.toString())))
    axios.get(endpoints.voices)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => reject(err))
  })
}

const getStats = () => {
  return new Promise((resolve, reject) => {
    axios.get(endpoints.stats)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => reject(err))
  })
}

const getContributionActivities = () => {
  return new Promise((resolve, reject) => {
    axios.get(endpoints.contribution_activity)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => reject(err))
  })
}

const getClipsVotes = () => {
  return new Promise(async (resolve, reject) => {

    await Promise.all([
      sendGetRequest(endpoints.clips_daily_count),
      sendGetRequest(endpoints.clips_daily_votes_count)
    ]).then(([clips, votes]) => { // <= notice the function parameters
      resolve({ clipsDailyCount: clips, clipsVotesDailyCount: votes })
    }).catch(err => reject(err))

  })
}

const sendGetRequest = (endpoint) => {
  return new Promise((resolve, reject) => {
    axios.get(endpoint)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => reject(err))
  })
}


module.exports = {
  getLanguageStats,
  getVoices,
  getStats,
  getContributionActivities,
  getClipsVotes
}
