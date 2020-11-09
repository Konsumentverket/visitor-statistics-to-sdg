const getConfiguration = require("../lib/getConfiguration")
const formatGtmDataToSdg = require("../lib/formatGtmDataToSdg")
const getGtmData = require("../lib/getGtmData")
const sendToCommision = require("../lib/sendToCommision")
const validateConfiguration = require("../lib/validateConfiguration")
const { getSdgUniqueId,postStatistics } = require("../lib/sdgClient")

module.exports = async function (context, req) {
    try{
        const configurations = getConfiguration(context)
        validateConfiguration(configurations)

        const gtmData = await getGtmData(context,configurations.gtmObjects)
        const uniqueSdgId = await getSdgUniqueId(context,configurations)
        const sdgFormated = formatGtmDataToSdg(context,gtmData,uniqueSdgId)
        const postDataResponse = await postStatistics(context,sdgFormated,configurations)
        context.res = {
            body: postDataResponse
        };
        context.done();
    
    }
    catch(e){
        context.log("Request failed!",e)
        context.res = {
            status: 500,
            body: e
        };
        context.done();
    }
}