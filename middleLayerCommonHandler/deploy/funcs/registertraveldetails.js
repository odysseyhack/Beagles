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
    process: registerTravelDetails
};
