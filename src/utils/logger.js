require('../store/mongo')
const {DateTime} = require('luxon')
const Log = require("../models/Log")
const Error = require("../models/Error")


const insertLog = async (operationMessage) => {

  const log = new Log({
    date: DateTime.now().toUTC(),
    operation: operationMessage
  })

  await log.save()
    .catch(err => console.log(err))
}

const insertError = async (errorMessage, operation) => {
  const error = new Error({
    date: DateTime.now().toUTC(),
    message: errorMessage,
    operation: operation
  })
  await error.save()
    .catch(err => console.log(err))
}

module.exports = {
  insertLog,
  insertError
}