module.exports = {
  endpoints: {
    language_stats: "https://commonvoice.mozilla.org/api/v1/stats/languages",
    voices: "https://commonvoice.mozilla.org/api/v1/ca/clips/voices",
    stats: "https://commonvoice.mozilla.org/api/v1/ca/clips/stats",
    contribution_activity: "https://commonvoice.mozilla.org/api/v1/ca/contribution_activity?from=everyone",
    clips_daily_count: "https://commonvoice.mozilla.org/api/v1/ca/clips/daily_count",
    clips_daily_votes_count: "https://commonvoice.mozilla.org/api/v1/ca/clips/votes/daily_count"
  },
  sheets: {
    daily_report_id: "10oHwwVgl7E70_dracWn-ncg36IUE0gTVRPPQ0UoWzcc",
    multiple_id: "10oHwwVgl7E70_dracWn-ncg36IUE0gTVRPPQ0UoWzcc" ,
  },
  firstWeekDate: '2022-02-15T00:00:00.000Z',
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
