require("../store/mongo")
const LanguageStat = require("../models/LanguageStat")
const { insertError } = require('../utils/logger')

const addLanguageStat = async (stat) => {

    const lngStat = new LanguageStat({
      date: stat.date,
      languages: stat.languages,
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


    const info = languageStats.languages?.find(l => l.locale === locale) || languageStats.launched?.find(l => l.locale === locale)
    // const checkInfoFormat = languageStats.languages ? languageStats.languages.find(l => l.locale === locale) : languageStats.launched.find(l => l.locale === locale)

    return {_id: languageStats._id, date: languageStats.date, info: info}

    // return languageStats.launched.filter(e => e.locale === locale)[0]

  //   return LanguageStat.findOne({"launched.locale": locale})
  //       .sort({date: 1});

}


const getLanguageStatsByLanguageCode = async (locale) => {

    const languageStats = await LanguageStat.findOne({"languages.locale": locale})
                                            .sort({date: -1})

    if (!languageStats) {
        throw Error("Language stats not found...")
    }

    return languageStats.languages.filter(e => e.locale === locale)[0]
}

module.exports = {
  addLanguageStat,
  getLanguageStatsByLanguageCode,
  getLanguageStatNextDayByLocale
}

