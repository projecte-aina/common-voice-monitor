require('./store/mongo')

const Cron = require('croner')

const { updateLanguageStats } = require('./updates/update_language_stats')
const { updateVoices } = require('./updates/update_voices')
const { updateStats } = require('./updates/update_stats')
const { updateContributionActivities } = require('./updates/update_contribution_activities')
const { updateClipsVotes } = require('./updates/update_clips_votes')
const {updateDailyReport} = require("./updates/update_daily_report");

const { insertError } = require('./utils/logger')



;(
  async () => {

    try {

      const everyDayDailyReport = new Cron('0 2 * * *', {maxRuns: Infinity})
      const everyFiftyEightMinutes = new Cron('58 * * * *', {maxRuns: Infinity})
      const languageStatsScheduler = new Cron('0 0/2 * * *', {maxRuns: Infinity})
      const everyHourScheduler = new Cron('0 0/1 * * *', {maxRuns:Infinity})

      everyFiftyEightMinutes.schedule(async () => {
        await updateClipsVotes()
      });

      languageStatsScheduler.schedule(async () => {
        await updateLanguageStats()

      })

      everyHourScheduler.schedule(async () => {
        await Promise.allSettled([updateVoices(), updateStats(), updateContributionActivities()])
      })

      everyDayDailyReport.schedule(async () => {
        await updateDailyReport()
      })


    } catch (error) {
      await insertError(error, 'On main scheduler')
    }

  }
)()
