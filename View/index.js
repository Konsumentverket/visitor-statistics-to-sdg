const getConfiguration = require("../lib/getConfiguration")
const formatGtmDataToSdg = require("../lib/formatGtmDataToSdg")
const getGtmData = require("../lib/getGtmData")
const validateConfiguration = require("../lib/validateConfiguration")

module.exports = async function (context, req) {
    try{
        const configurations = getConfiguration(context)

        validateConfiguration(configurations)
        
        const gtmData = await getGtmData(context,configurations.gtmObjects)
        const sdgFormated = formatGtmDataToSdg(context,gtmData,"debug")
        context.res = {
            body: sdgFormated
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