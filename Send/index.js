const getConfiguration = require("../lib/getConfiguration")
const formatGtmDataToSdg = require("../lib/formatGtmDataToSdg")
const getGtmData = require("../lib/getGtmData")
const validateConfiguration = require("../lib/validateConfiguration")
const { getSdgUniqueId,postStatistics } = require("../lib/sdgClient")

module.exports = async function (context, req) {
    try{
        const configuration = getConfiguration(context)
        validateConfiguration(configuration)

        if(!configuration.useAcceptence){
            throw Error("Send only allowed to be used in acceptence testing mode")
        }

        const gtmData = await getGtmData(context,configuration.gtmObjects)
        const uniqueSdgId = await getSdgUniqueId(context,configuration)
        const sdgFormated = formatGtmDataToSdg(context,gtmData,uniqueSdgId)
        const postDataResponse = await postStatistics(context,sdgFormated,configuration)
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