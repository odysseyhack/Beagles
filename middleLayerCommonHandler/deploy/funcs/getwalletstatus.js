// Dependencies
const krypcore = require('../krypcore.js');


function getWalletStatus(inParams, callback) {
    console.log("getWalletStatus");
    console.log("mobIdToken = ", inParams.mobIdToken);
    console.log("requestDate = ", inParams.requestDate);

    const kcReqBody = {
        "StructureId": "walletstatereport",
        "Payload": {
            "primaryId": inParams.mobIdToken,
            "reqDte": krypcore.generateDate(inParams.requestDate)
        }
    };

    const outBody = {
            valid: false,
            validUntil: null,
            errorMessage: null
        };
    
    // Call KrypC walletstatereport
    krypcore.invokeAPI('/kc/api/ledgerChainCode/requestReport', kcReqBody, function(kcResContent) {

        if (kcResContent.Extra && kcResContent.Extra[0]) {
            outBody.valid = kcResContent.Extra[0].mapsByNameAndFieldValue.IDTokenStatus.value == "Active";
            outBody.validUntil = kcResContent.Extra[0].mapsByNameAndFieldValue.entDt.value.cvalue;
        }
        else {
        	outBody.errorMessage = "No Extra field found.";
        }

        callback(outBody);

    }, function(errorMessage) {
    	outBody.errorMessage = errorMessage;
        callback(outBody);
    });

}

module.exports = {
    process: getWalletStatus
};
