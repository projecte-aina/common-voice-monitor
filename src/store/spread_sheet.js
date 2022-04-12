const { GoogleSpreadsheet } = require('google-spreadsheet')
const credentialsFile = require('../../private-key.json')



const loadDocument = ({id}) => {
  const doc = new GoogleSpreadsheet(id)
  doc.useServiceAccountAuth(credentialsFile)
      .then(() => console.log('Google Sheets API - Authentication successful'))
      .catch(err => console.log(err))

  return doc

}

const getDocTitle = async (doc) => new Promise(async (resolve, reject) => {
  await doc.loadInfo()
  resolve(doc.title)
})


const getAllSheets = ({doc}) => {
  return new Promise(async (resolve) => {
    await doc.loadInfo()
    resolve(doc.sheetsByTitle)
  })
}

const getSheetByName = ({doc, name}) => {
  return new Promise(async (resolve, reject) => {
    await doc.loadInfo()
    resolve(doc.sheetsByTitle[name])
  })
}

const addElement = async ({doc, sheetName, obj, headersRowIndex=1}) => {
  await doc.loadInfo()

  const sheet = await getSheetByName({doc: doc, name: sheetName})

  await sheet.loadHeaderRow(headersRowIndex)

  await sheet.addRow(obj)

}

const addElements = async ({doc, sheetName, rows, headersRowIndex=1}) => {
  await doc.loadInfo()
  const sheet = await getSheetByName({doc: doc, name: sheetName})
  await sheet.loadHeaderRow(headersRowIndex)
  await sheet.addRows(rows)
}

module.exports = {
  getDocTitle,
  getAllSheets,
  addElement,
  addElements,
  loadDocument
}
