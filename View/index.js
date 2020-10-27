const getConfiguration = require("../lib/getConfiguration")
const formatGtmDataToSdg = require("../lib/formatGtmDataToSdg")
const getGtmData = require("../lib/getGtmData")
const sendToCommision = require("../lib/sendToCommision")

module.exports = async function (context, req) {
    try{
        const configurations = getConfiguration(context)

        if(!configurations || configurations.length == 0){
            throw new Error("Failed to load configurations")
        }
        else{
            const gtmData = await getGtmData(context,configurations)
            const sdgFormated = formatGtmDataToSdg(context,gtmData)
            const commissionResponse = await sendToCommision(context,sdgFormated)
            context.res = {
                body: sdgFormated
            };
            context.done();
        }
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