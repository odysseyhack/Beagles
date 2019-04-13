// Dependencies
const krypcore = require('../krypcore.js');


function getTransactionReport(inParams, callback) {
    console.log("getTransactionReport");
    console.log("mobIdToken = ", inParams.mobIdToken);

    const kcReqBody = {
        "Program": "digitalmes",
        "Receiver": {
            "ID": "opeuser",
            "MSPID": "Org1MSP"
        },
        "StructureId": "transactionreport",
        "Payload": {
            "primId": [inParams.mobIdToken]
        },
        "sm": 2,
        "sm_uid": "passengerone",
        "sm_pwd": "password",
        "ChainCodeId": "ledger",
        "ChannelId": "orgchannel"
    };

    // Call KrypC walletstatereport
    krypcore.invokeAPI('/kc/api/ledgerChainCode/requestReport', kcReqBody, function(succeed, kcResContent) {

        console.log("succeed = ", succeed);
        //console.log("kcResContent = ", kcResContent);

        const outBody = {
            transactions: []
        };

        if (succeed) {
            if ((kcResContent.Status || kcResContent.status) && kcResContent.Extra[0]) {

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
    process: getTransactionReport
};
