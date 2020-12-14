module.exports = function(context,useAcceptance){

    if(useAcceptance){
        context.log(`Using acceptance endpoints`)
        return {
            uniqueIdEndpointUrl: "https://collect.sdgacceptance.eu/v1/unique-id",
            statisticsForInformationServicesUrl : "https://collect.sdgacceptance.eu/v1/statistics/information-services"

        }
        
    }else{
        context.log(`Using prod endpoints`)
        return {
            uniqueIdEndpointUrl: "https://collect.youreurope.europa.eu/v1/unique-id",
            statisticsForInformationServicesUrl : "https://collect.youreurope.europa.eu/v1/statistics/information-services"
        }
    }
}