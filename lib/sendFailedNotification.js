const axios = require('axios');

module.exports = async function (context,err,useAcceptence, id) {
    const webHookUrl = process.env["MS_TEAMS_WEBHOOK"]
    if(webHookUrl == null) return false;

    //removing html tags
    const error = JSON.stringify(err, Object.getOwnPropertyNames(err))
                    .replace(/(<([^>]+)>)/ig," ")

    try{
        const teamsObj = {
            "@type": "MessageCard",
            "@context": "https://schema.org/extensions",
            "summary": "Issue 176715375",
            "themeColor": "B00020",
            "title": "SDG statistics delivery failed!",
            "sections": [{
                "title": "Data:",
                "facts": [{
                        "name": "RefId",
                        "value": id
                    }, {
                        "name": "Error",
                        "value": error
                    },{
                        "name": "Acceptence",
                        "value": useAcceptence
                    }
                ],
            }]
        }

        const response = await axios.post(webHookUrl,
            JSON.stringify(teamsObj)
        );



        return true;
    }
    catch(err){
        return false;
    }

}
