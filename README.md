
# commonvoice-monitor

Fetch data from common voice and save it to a database for later analysis



## Prerequisites

- node >=16.14.2
- npm >=8.6.0
- pm2 >=5.2.0
- mongodb
- google spreadsheet credential file (service account) as private-key.json 
## Installation

Install commonvoice-monitor
 with npm

```bash
  npm install pm2 -g  
  npm install
```
    
## Run Locally

Clone the project

```bash
  git clone https://github.com/projecte-aina/common-voice-monitor
```

Go to the project directory

```bash
  cd common-voice-monitor
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Config file

Setup mongo uri and google spreadsheet ids
```javascript
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
```
## Authors

- [@PaulNdrei](https://github.com/PaulNdrei)
- [@gullabi](https://github.com/gullabi)



