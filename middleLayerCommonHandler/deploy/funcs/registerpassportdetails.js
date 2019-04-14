// Dependencies
const uuidv4 = require('uuid/v4');
const krypcore = require('../krypcore.js');

function registerPassportDetails(inBody, callback) {
    console.log("registerPassportDetails");
    
    // Generate unique token
    const mobId = uuidv4();
    
    // validity period = today plus 5 days
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 5);
    

    const kcReqBody = {
        "StructureId": "psprtdetails",
        "Payload": {
            "aYrs": inBody.age,
            "entDt": krypcore.generateDate(inBody.requestDate),
            "gendr": inBody.gender,
            "issuingCntry": inBody.issuingCountry,
            "primaryid": mobId,
            "pstate": inBody.passportStatus,
            "refId": null
        }
    };

    const outBody = {
            registrationOK: false,
            mobIdToken: null,
            validUntil: null,
            errorMessage: null
        };
    
    // Call KrypC psprtdetails
    krypcore.invokeAPI('/kc/api/ledgerChainCode/sendMessage', kcReqBody, function(kcResContent) {

        outBody.registrationOK = true;
        outBody.validUntil = validUntil.toISOString();
        outBody.mobIdToken = mobId;
        callback(outBody);

    }, function(errorMessage) {
    	outBody.errorMessage = errorMessage;
        callback(outBody);
    });
}

module.exports = {
    process: registerPassportDetails
};
