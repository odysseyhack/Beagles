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

    const outBody = {
            processingOK: false,
            errorMessage: null
        };
    
    // Call KrypC traveldetails
    krypcore.invokeAPI('/kc/api/ledgerChainCode/sendMessage', kcReqBody, function(kcResContent) {
        outBody.processingOK = true;
        callback(outBody);
    }, function(errorMessage) {
    	outBody.errorMessage = errorMessage;
        callback(outBody);
    });
}

module.exports = {
    process: forgetMe
};
