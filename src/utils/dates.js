const {DateTime} = require("luxon");
const getOldestObjectDateFromList = (list) => {

    let oldest = {}

    if (list.length > 1) {
        const mostOldestDate = new Date(Math.min.apply(null, list.map(e => {
            return e.date;
        })));

        oldest = list.find(e => {
            return e.date.getTime() === mostOldestDate.getTime();
        })
    }

    return oldest

}

const createStartEndOfDayUtcDateRange = (utcDate) => {
    return {startOfDay: utcDate.startOf('day').toISO(), endOfDay: utcDate.endOf('day').toISO()}

}

const getIsoDateFromFormat = (dateString, format) => {
    return DateTime.fromFormat(dateString, format, {zone: 'utc'}).toISO()
}

module.exports = {
    getOldestObjectDateFromList,
    createStartEndOfDayUtcDateRange,
    getIsoDateFromFormat
}