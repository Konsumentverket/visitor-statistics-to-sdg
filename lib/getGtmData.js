const {google} = require('googleapis');
const url = require('url');
const requiredGtmFields = require('./requiredGtmFields');

const parseRawUrlToObject = function(context,rawQuery){
    return url.parse(rawQuery,true).query;
}

const validateRequiredFields = function(queryObj){

    const metricsAndDimentions = [
        ...queryObj.metrics.split(','),
        ...queryObj.dimensions.split(',')
    ]

    if(!metricsAndDimentions.some(x => x == requiredGtmFields.hostName)) throw new Error("required field, missing "+requiredGtmFields.hostName)

    if(!metricsAndDimentions.some(x => x == requiredGtmFields.deviceCategory)) throw new Error("required field, missing "+requiredGtmFields.deviceCategory)

    if(!metricsAndDimentions.some(x => x == requiredGtmFields.pagePath)) throw new Error("required field, missing "+requiredGtmFields.pagePath)

    if(!metricsAndDimentions.some(x => x == requiredGtmFields.countryIsoCode)) throw new Error("required field, missing "+requiredGtmFields.countryIsoCode)

    if(!metricsAndDimentions.some(x => requiredGtmFields.uniquePageviews.some(y => y == x))) throw new Error("required field, missing "+requiredGtmFields.uniquePageviews)

}

/**
 * getGtmData makes a request to google analytics and collects data based on the configurations
 * @param  {object} context The Azure function context object
 * @param  {object} configurations The configurations to use for fetching data 
 * @return {object} Raw gtm data
 */
module.exports = async function (context,configurations) {

    const auth = new google.auth.GoogleAuth({
        keyFile: './googleSdgKey.json',
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    const promises = configurations.map(cfg => {
        return new Promise(async (resolve,reject) => {
            context.log("cfg",cfg)
            try{
                const queryObj = parseRawUrlToObject(context,cfg.rawQuery)
                validateRequiredFields(queryObj)


                queryObj.auth = auth;
                var data = await google.analytics("v3").data.ga.get(queryObj)
                if(data.status === 200){
                    context.log("Google response",data)
                    resolve({
                        site:cfg.site,
                        gtmQuery: cfg.rawQuery,
                        gtmData:data
                    })
                }
                else{
                    reject("Google analytics request failed, status: "+ data.status + " statusText: "+data.statusText)
                }
            }
            catch(e){
                reject(e.message)
            }
        })
    })

    let retVal = []

    await Promise.all(promises).then(x => retVal = x);

    return retVal;

}