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

        let message = `getSdgUniqueId failed: ${e.message} `
        if(e.response != null){
            message = message + "response: "+ JSON.stringify(e.response,Object.getOwnPropertyNames(e.response))
        }

        throw new Error(message)
    }
}

const postStatistics = async function(context, sdgData,configuration){
    try{
        const sdgJson = JSON.stringify(sdgData);
        const response = await axios.post(configuration.endpoints.statisticsForInformationServicesUrl,
            sdgJson,
            {
                headers:{
                    "x-api-key": configuration.sdgApiKey,
                    "Content-Type": "application/json"
                }
            }
        )

        if(!response.config.validateStatus(response.status)){
            throw new Error("Server returned Status:"+ response.status + " Data: "+ response.data)
        }

        return response.status+" "+response.data
    }
    catch(e){
        context.log(e)

        let message = `postStatistics failed: ${e.message} `
        if(e.response != null){
            message = message + "response: "+ JSON.stringify(e.response,Object.getOwnPropertyNames(e.response))
        }
        throw new Error(`postStatistics failed: ${e.message}`)
    }
}



module.exports = {
    getSdgUniqueId,
    postStatistics
}