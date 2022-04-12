const DailyReportModel = require('../models/DailyReport');

const dailyReportEventEmitter = DailyReportModel.watch()

dailyReportEventEmitter.on('change', (change) => {
    console.log(change)
})

