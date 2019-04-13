// Dependencies
const krypcore = require('../krypcore.js');


function getWalletStatus(inParams, callback) {
    console.log("getWalletStatus");
    console.log("mobIdToken = ", inParams.mobIdToken);
    console.log("requestDate = ", inParams.requestDate);

    const kcReqBody = {
        "Program": "digitalmes",
        "Receiver": {
            "ID": "opeuser",
            "MSPID": "Org1MSP"
        },
        "StructureId": "walletstatereport",
        "Payload": {
            "primaryId": inParams.mobIdToken,
            "reqDte": krypcore.generateDate(inParams.requestDate)
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
            valid: false,
            validUntil: null,
            errorMessage: null
        };

        if (succeed) {
            if ((kcResContent.Status || kcResContent.status) && kcResContent.Extra[0]) {
                outBody.valid = kcResContent.Extra[0].mapsByNameAndFieldValue.IDTokenStatus.value == "Active";
                outBody.validUntil = kcResContent.Extra[0].mapsByNameAndFieldValue.entDt.value.cvalue;
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
    process: getWalletStatus
};
