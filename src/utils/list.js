const convertArrayToObject = (array) => {

    let objs = []

    for ( const [key, value] of Object.entries(array[0])) {
        objs.push({[key]: value[0]});
    }

    return objs.reduce((key, value) => Object.assign(key, value), {})

}

module.exports = {
    convertArrayToObject
}