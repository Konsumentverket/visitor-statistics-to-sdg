



module.exports = async function (configuration) {

    if(!configuration)
        throw new Error("Configuration is null")
    if(!configuration.sdgApiKey)
        throw new Error("Missing Sdg API key configuration")
    if(!configuration.endpoints)
        throw new Error("Missing endpoints configuration")

}