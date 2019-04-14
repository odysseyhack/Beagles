// Dependencies
const krypcore = require('../krypcore.js');


function getTransactionReport(inParams, callback) {
    console.log("getTransactionReport");
    console.log("mobIdToken = ", inParams.mobIdToken);

    const kcReqBody = {
        "StructureId": "transactionreport",
        "Payload": {
            "primId": [inParams.mobIdToken]
        }
    };

    const outBody = {
            transactions: [],
            errorMessage: null
        };
    
    // Call KrypC walletstatereport
    krypcore.invokeAPI('/kc/api/ledgerChainCode/requestReport', kcReqBody, function(kcResContent) {

    	if (kcResContent.Extra && kcResContent.Extra[0])
    	{
	        const extra = kcResContent.Extra[0];
	        for (var i = 0; i < extra.length; i++) {
	            outBody.transactions[i] = {
	                mobIdToken: extra[i].mapsByNameAndFieldValue.primaryId.value,
	                requestDate: extra[i].mapsByNameAndFieldValue.reqDate.value.cvalue,
	                requestId: extra[i].mapsByNameAndFieldValue.requestId.value,
	                requestType: extra[i].mapsByNameAndFieldValue.requestType.value
	            };
	        }
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
    process: getTransactionReport
};
