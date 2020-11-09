const axios = require('axios');


const getSdgUniqueId = async function(context,configuration){

    try{
        const response = await axios.get(configuration.endpoints.uniqueIdEndpointUrl,{
            headers:{
                "x-api-key": configuration.sdgApiKey
            }
        })
        return response.data
    }
    catch(e){
        context.log(e)
        throw `getSdgUniqueId failed: ${e.message}`
    }
}

const postStatistics = async function(context, sdgData,configuration){
    try{
        const sdgJson = JSON.stringify(sdgData);
        const response = await axios.post(configuration.endpoints.statisticsForInformationServicesUrl,
            sdgJson,
            {
                headers:{
                    "x-api-key": configuration.sdgApiKey
                }
            }
        )
        return response.data
    }
    catch(e){
        context.log(e)
        throw `postStatistics failed: ${e.message}`
    }
}



module.exports = {
    getSdgUniqueId,
    postStatistics
}