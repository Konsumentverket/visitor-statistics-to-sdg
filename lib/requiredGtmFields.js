const moment = require("moment");

/**
 * requiredGtmFields The fields that are required to be collected from GTM to meet SDG requirements
 */
module.exports = {
    hostName: "ga:hostname",
    deviceCategory: "ga:deviceCategory",
    pagePath: "ga:pagePath",
    countryIsoCode: "ga:countryIsoCode",
    uniquePageviews: ["ga:pageviews","ga:uniquePageviews"],
}
