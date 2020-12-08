const getEndpoints = require("./getEndpoints");


const extractGtmEnvSettings = function(context){
    const envKeys = Object.keys(process.env);
    const gtmKeys = envKeys.filter(x => x.startsWith("GTM_"))
    const gtmObjects = gtmKeys.map(x => {        
        const jsonStr = process.env[x]
        context.log(`Configuration found! Key: ${x} Value:${jsonStr}`)
        const parsedObj = JSON.parse(jsonStr)
        return parsedObj
    }).filter(x => x)
    return gtmObjects
}

/**
 * getConfiguration reads configuration from the environment and formats it. It reads configurations that starts with GTM_
 * @param  {object} context The Azure function context object
 * @return {Object} Configuration
 */
module.exports = function (context) {
    const gtmObjects = extractGtmEnvSettings(context)
    const sdgApiKey = process.env["SDG_API_KEY"]
    const useAcceptence = process.env["USE_SDG_ACCEPTENCE"] == "true"
    const endpoints = getEndpoints(context,useAcceptence)
    

    return {
        useAcceptence,
        gtmObjects,
        sdgApiKey,
        endpoints
    }

}