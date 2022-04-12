require("../store/mongo")
const ContributionActivity = require("../models/ContributionActivity")
const { insertError } = require('../utils/logger')

const addContributionActivities = async (contributionActivities) => {

  let inserted = []

  for (let contribution of contributionActivities) {

    const contributionActivity = new ContributionActivity({
      date: contribution.date,
      value: contribution.value
    })

    try {
      await contributionActivity.save()
      inserted.push(contributionActivity)
    }catch (e) {
      await insertError(e, 'On save contribution activity')
    }
  }

  return inserted
}

module.exports = {
  addContributionActivities
}

