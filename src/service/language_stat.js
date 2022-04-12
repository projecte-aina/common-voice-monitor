require("../store/mongo")
const LanguageStat = require("../models/LanguageStat")
const { insertError } = require('../utils/logger')

const addLanguageStat = async (stat) => {

    const lngStat = new LanguageStat({
      date: stat.date,
      inProgress: stat.inProgress,
      launched: stat.launched
    })

    try {
      await lngStat.save()
    }catch (e) {
      await insertError(e, "On save language stat")
    }
}

const getLanguageStatNextDayByLocale = async (locale, date) => {
    //         const refLanguageStats = await languageStats('ca').find({date:{$gte: ISODate("[date+1 day]")}}).sort([ascending])[0]

    const languageStats = await LanguageStat.findOne({date: {$gte: date.plus({days: 1})} }).sort({date: 1})

    if (!languageStats) {
        throw Error("Language stats not found...")
    }

    return {_id: languageStats._id, date: languageStats.date, info: languageStats.launched.find(l => l.locale === locale)}

    // return languageStats.launched.filter(e => e.locale === locale)[0]

  //   return LanguageStat.findOne({"launched.locale": locale})
  //       .sort({date: 1});

}


const getLanguageStatsByLanguageCode = async (locale) => {

    const languageStats = await LanguageStat.findOne({"launched.locale": locale})
                                            .sort({date: -1})

    if (!languageStats) {
        throw Error("Language stats not found...")
    }

    return languageStats.launched.filter(e => e.locale === locale)[0]
}

module.exports = {
  addLanguageStat,
  getLanguageStatsByLanguageCode,
  getLanguageStatNextDayByLocale
}

