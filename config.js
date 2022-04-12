module.exports = {
  endpoints: {
    language_stats: "https://commonvoice.mozilla.org/api/v1/language_stats",
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
  environments: {
    development: {
      mongoUri: 'mongodb://localhost:27017/commonvoice_monitor_development',
    },
    integration: {
      mongoUri: 'mongodb://129.151.225.145:49153/commonvoice_monitor',
    },
    production: {
      mongoUri: 'mongodb://localhost:3002/commonvoice_monitor',
    }
  }
}
