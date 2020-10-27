
/**
 * getConfiguration reads configuration from the environment and formats it. It reads configurations that starts with GTM_
 * @param  {object} context The Azure function context object
 * @return {Array} Array of Configurations objects
 */
module.exports = function (context) {
    const envKeys = Object.keys(process.env);
    const gtmKeys = envKeys.filter(x => x.startsWith("GTM_"))
    const gtmObjects = gtmKeys.map(x => {        
        var jsonStr = process.env[x]
        context.log(`Configuration found! Key: ${x} Value:${jsonStr}`)
        var parsedObj = JSON.parse(jsonStr)
        return parsedObj
    }).filter(x => x)
    return gtmObjects
}