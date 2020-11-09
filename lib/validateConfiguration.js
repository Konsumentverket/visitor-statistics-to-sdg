



module.exports = async function (configuration) {

    if(!configuration)
        throw "Configuration is null"
    if(!configuration.sdgApiKey)
        throw "Missing Sdg API key configuration"
    if(!configuration.endpoints)
        throw "Missing endpoints configuration" 

}