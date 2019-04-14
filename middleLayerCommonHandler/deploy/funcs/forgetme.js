// Dependencies
const krypcore = require('../krypcore.js');

function forgetMe(inBody, callback) {
    console.log("forgetMe");
    console.log("mobIdTokenList = ", inBody.mobIdTokenList);

    const kcReqBody = {
        "StructureId": "forgetme",
        "Payload": {
            "primaryid": inBody.mobIdTokenList,
            "reqDate": krypcore.generateDate(inBody.requestDate)
        }
    };

    // Call KrypC traveldetails
    krypcore.invokeAPI('/kc/api/ledgerChainCode/sendMessage', kcReqBody, function(succeed, kcResContent) {

        console.log("succeed = ", succeed);
        //console.log("kcResContent = ", kcResContent);

        const outBody = {
            processingOK: false,
            errorMessage: null
        };


        if (succeed) {
            if (kcResContent.Status || kcResContent.status) {
                outBody.processingOK = true;
            }
            else {
                outBody.errorMessage = kcResContent.message;
            }
        }
        else {
            outBody.errorMessage = kcResContent;
        }

        callback(outBody);

    });
}

module.exports = {
    process: forgetMe
};
