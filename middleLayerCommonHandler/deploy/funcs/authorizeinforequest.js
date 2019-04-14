// Dependencies
const storage = require('../storage.js');
const krypcore = require('../krypcore.js');

function authorizeInfoRequest(inBody, callback) {
    console.log("authorizeInfoRequest");
    console.log("requestId = ", inBody.requestId);

    const outBody = {
        processingOK: false,
        errorMessage: null
    };

    const exitWithError = function(errorMessage) {
        outBody.errorMessage = errorMessage;
        callback(outBody);
    }

    // Get registered request
    storage.getRequest(
        inBody.requestId,
        function(item) {
            if (item.isCompleted) {
                exitWithError("The request id '" + inBody.requestId + "' has been already " + (item.isAuthorized ? "authorized." : "declined."));
            }
            else {

                if (inBody.declineAuthorization) {

                    item.sharedAttributes = null;
                    item.isCompleted = true;
                    item.isAuthorized = false;

                    // Temporary store shared information
                    storage.storeRequest(
                        item,
                        function() {
                            outBody.processingOK = true;
                            callback(outBody);
                        }, exitWithError);

                }
                else {

                    const kcReqBody = {
                        "Receiver": {
                            "ID": krypcore.getRequestTypeUser(inBody.requestType),
                        },
                        "StructureId": "inforequests",
                        "Payload": {
                            "additionalDtls": inBody.requesterId + "|" + inBody.accessPointId,
                            "bookId": inBody.bookingId,
                            "primaryId": inBody.mobIdToken,
                            "reqDate": krypcore.generateDate(inBody.requestDate),
                            "requestId": inBody.requestId,
                            "requestType": inBody.requestType
                        }
                    };

                    // Call KrypC inforequests
                    krypcore.invokeAPI('/kc/api/ledgerChainCode/sendMessage', kcReqBody, function(kcResContent) {

                        item.sharedAttributes = inBody.attributes;
                        item.isCompleted = true;
                        item.isAuthorized = true;

                        // Temporary store shared information
                        storage.storeRequest(item, function() {
                            outBody.processingOK = true;
                            callback(outBody);
                        }, exitWithError);

                    }, exitWithError);
                }

            }

        }, exitWithError);

}

module.exports = {
    process: authorizeInfoRequest
};
