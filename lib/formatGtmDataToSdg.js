const moment = require("moment");
const requiredGtmFields = require("./requiredGtmFields");

const transformDeviceName = function(gtmDeviceName){
    switch(gtmDeviceName){
        case "mobile":
            return "Mobile"
        case "desktop":
            return "PC"
        case "tablet":
            return "Tablet"
        default:
            throw new Error("Failed to find transform for device "+gtmDeviceName)
    }
}

const transformGtmHits = function(data){

    const hostNameIndex = data.gtmData.data.columnHeaders.findIndex(x => x.name == requiredGtmFields.hostName);
    const deviceCategoryIndex = data.gtmData.data.columnHeaders.findIndex(x => x.name == requiredGtmFields.deviceCategory);
    const pagePathIndex = data.gtmData.data.columnHeaders.findIndex(x => x.name == requiredGtmFields.pagePath);
    const countryIsoCodeIndex = data.gtmData.data.columnHeaders.findIndex(x => x.name == requiredGtmFields.countryIsoCode);
    const uniquePageviewsIndex = data.gtmData.data.columnHeaders.findIndex(x => requiredGtmFields.uniquePageviews.find(y => y == x.name));

    var retval = [];

    data.gtmData.data.rows.forEach(row => {
        
        const hostName = row[hostNameIndex]
        const deviceCategory = row[deviceCategoryIndex]
        const pagePath = row[pagePathIndex]
        const countryIsoCode = row[countryIsoCodeIndex]
        const uniquePageviews = row[uniquePageviewsIndex]

        let sourceObj = retval[pagePath]
        if(sourceObj == null){
            sourceObj = {
                sourceUrl: `https://${hostName}${pagePath}`,
                statistics:[]
            }
            retval[pagePath] = sourceObj
        }

        sourceObj.statistics.push({
            "deviceType": transformDeviceName(deviceCategory),
            "nbVisits": parseInt(uniquePageviews),
            "originatingCountry": countryIsoCode
        })

    })
    return Object.values(retval);
}

/**
 * formatGtmDataToSdg Formats the GTM data to the SDG specific format
 * @param  {object} context The Azure function context object
 * @param  {object} data unformated data from google analytics
 * @return {object} Sdg formated object
 */
module.exports = function (context,data,uniqueId) {
    const transferData = moment().format('YYYY-MM-DDT00:00:00Z');
    const startData = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
    const endDate = moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DDTHH:mm:ssZ')

    const sdgFormated = {
        "uniqueId": uniqueId,
        "referencePeriod": {
            "startDate": startData,
            "endDate": endDate
        },
        "transferDate": transferData,
        "transferType": "API",
        "nbEntries": 0,
        "sources": []
    }
    

    data.forEach(gtmItem => {
        const sdgSources = transformGtmHits(gtmItem);
        sdgFormated.nbEntries = sdgFormated.nbEntries + sdgSources.length
        sdgSources.forEach(x => sdgFormated.sources.push(x))
    })



    return sdgFormated;
}