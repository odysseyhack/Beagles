// Dependencies
const krypcore = require('../krypcore.js');

function registerTravelDetails(inBody, callback) {
    console.log("registerTravelDetails");

    const kcReqBody = {
        "StructureId": "traveldetails",
        "Payload": {
            "airline": inBody.airlineId,
            "bookId": inBody.bookingId,
            "loungAcc": inBody.loungeAccess,
            "shopNote": inBody.shopNotifications,
            "travelType": inBody.travelType,
            "trvlDate": krypcore.generateDate(inBody.travelDate)
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
    process: registerTravelDetails
};
