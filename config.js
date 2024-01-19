module.exports = {
  endpoints: {
    language_stats: "https://commonvoice.mozilla.org/api/v1/stats/languages",
    voices: `https://commonvoice.mozilla.org/api/v1/${process.env.LOCALE}/clips/voices`,
    stats: `https://commonvoice.mozilla.org/api/v1/${process.env.LOCALE}/clips/stats`,
    contribution_activity: `https://commonvoice.mozilla.org/api/v1/${process.env.LOCALE}/contribution_activity?from=everyone`,
    clips_daily_count: `https://commonvoice.mozilla.org/api/v1/${process.env.LOCALE}/clips/daily_count`,
    clips_daily_votes_count: `https://commonvoice.mozilla.org/api/v1/${process.env.LOCALE}/clips/votes/daily_count`
  },
  sheets: {
    daily_report_id: process.env.GOOGLE_SHEETS_DOCUMENT_ID,
    multiple_id: process.env.GOOGLE_SHEETS_DOCUMENT_ID ,
  },
  firstWeekDate: process.env.FIRST_WEEK_DATE,
  environments: {
    development: {
      mongoUri: process.env.MONGO_URI,
    },
    integration: {
      mongoUri: process.env.MONGO_URI,
    },
    production: {
      mongoUri: process.env.MONGO_URI,
    }
  }
}
