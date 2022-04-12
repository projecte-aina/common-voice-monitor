require("../store/mongo")
const Stat = require("../models/Stat")
const { insertError } = require('../utils/logger')


const getAllStats = async () => {
  return Stat.find({});
}

const addStats = async (stats) => {

  let inserted = []

  for (let s of stats) {

    const stat = new Stat({
      date: s.date,
      total: s.total,
      valid: s.valid,
    })

    try {
      await stat.save()
      inserted.push(stat)
    }catch (e) {
      console.log(e)
      await insertError(e, "On save stat")
    }
  }

  return inserted
}

const getYesterdayStats = async ({start: startOfDayIsoDate, end: endOfDateIsoDate}) => {

  let list = null
  try {
    list = await Stat.find({
      date: {
        $gte: new Date(startOfDayIsoDate),
        $lt: new Date(endOfDateIsoDate)
      }
    })
  }catch (error) {
    console.log(error)
  }
  return list
}


const getStatByDateAscending = async (date) => {

  return Stat.findOne({date: {$gte: date}}).sort({date: 1})
}


const getStatByDayLatest = async (date) => {

  return Stat.findOne({date: {$gte: date, $lte: date.plus({days: 1})}}).sort({date: -1})
}


const getStatsBetweenDateRange = async (utcDateRange) => {

  return Stat.find({date: {
    $gte: new Date(utcDateRange.start),
    $lt: new Date(utcDateRange.end)
  }});
}
const getTwentyFourHours = async (utcDateRange) => {
  let list = null

  try {
    list = await Stat.aggregate([
      {
        $facet: {
          yesterdayStat: [ { $match: { date: {
                $gte: new Date(utcDateRange.yesterday.startOfDay),
                $lt: new Date(utcDateRange.yesterday.endOfDay)
              }}}, {$sort: {date: -1}}, {$limit: 1} ],
          todayStat : [ { $match: { date: {
                $gte: new Date(utcDateRange.today.startOfDay),
                $lt: new Date(utcDateRange.today.endOfDay)
              }}}, {$sort: {date: -1}}, {$limit: 1} ]
        }
      }
    ])
  }catch (error) {
    console.log(error)
  }

  return list

}

module.exports = {
  addStats,
  getStatByDayLatest,
  getYesterdayStats,
  getStatsBetweenDateRange,
  getTwentyFourHours,
  getAllStats
}

