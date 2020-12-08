const getConfiguration = require("../lib/getConfiguration")
const formatGtmDataToSdg = require("../lib/formatGtmDataToSdg")
const getGtmData = require("../lib/getGtmData")
const validateConfiguration = require("../lib/validateConfiguration")
const { getSdgUniqueId,postStatistics } = require("../lib/sdgClient")
const moment = require("moment");
const sendFailedNotification = require("../lib/sendFailedNotification")

module.exports = async function (context, timer) {
    let useAcceptence;
    try{
        const configuration = getConfiguration(context)
        useAcceptence= configuration.useAcceptence
        validateConfiguration(configuration)


        const gtmData = await getGtmData(context,configuration.gtmObjects)
        const uniqueSdgId = await getSdgUniqueId(context,configuration)
        const sdgFormated = formatGtmDataToSdg(context,gtmData,uniqueSdgId)
        const postDataResponse = await postStatistics(context,sdgFormated,configuration)
        
        context.bindings.sdgDeliveryLogItem = JSON.stringify({
            id: moment().format('YYYY-MM-DD hh:mm:ss'),
            success: true,
            isPastDue: timer.isPastDue,
            sdgResponse: postDataResponse,
            acceptence: useAcceptence,
            gtmData: gtmData,
            sdgData: sdgFormated
        });
    }
    catch(err){
        const id = moment().format('YYYY-MM-DD hh:mm:ss')
        const notificationSent = await sendFailedNotification(context,err,useAcceptence,id)
        context.log("Request failed!",err)
        context.bindings.sdgDeliveryLogItem = JSON.stringify({
            id: id,
            success: false,
            message: JSON.stringify(err, Object.getOwnPropertyNames(err)),
            isPastDue: timer.isPastDue,
            sdgResponse: null,
            acceptence: useAcceptence,
            gtmData: null,
            sdgData: null
        });
    }
    context.done();
}