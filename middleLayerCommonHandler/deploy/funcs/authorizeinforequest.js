// Dependencies
const AWS = require('aws-sdk');
const krypcore = require('../krypcore.js');


function authorizeInfoRequest(inBody, callback) {
    console.log("authorizeInfoRequest");
    console.log("requestId = ", inBody.requestId);

    const dbClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });


    // Get registered request
    dbClient.get({
        Key: {
            "requestId": inBody.requestId
        },
        TableName: 'info_request'
    }, function(error, data) {
        console.log("Result of getting item from info_request:");
        console.log(error);
        console.log(data);

        const outBody = {
            processingOK: false,
            errorMessage: null
        };

        if (error) {
            outBody.errorMessage = error.message;
            callback(outBody);
        }
        else {
            const item = data.Item;
            if (item != null) {

                if (item.isCompleted) {
                    outBody.errorMessage = "The request id '" + inBody.requestId + "' has been already " + (item.isAuthorized ? "authorized." : "declined.");
                    callback(outBody);
                }
                else {

                    if (inBody.declineAuthorization) {

                        item.sharedAttributes = null;
                        item.isCompleted = true;
                        item.isAuthorized = false;

                        // Temporary store shared information
                        dbClient.put({
                            Item: item,
                            TableName: 'info_request'
                        }, function(error, data) {
                            console.log("Result of updating item to info_request:");
                            console.log(error);
                            console.log(data);

                            if (error) {
                                outBody.errorMessage = error.message;
                            }
                            else {
                                outBody.processingOK = true;
                            }

                            callback(outBody);
                        });

                    }
                    else {

                        const kcReqBody = {
                            "Program": "digitalmes",
                            "Receiver": {
                                "ID": krypcore.getRequestTypeUser(inBody.requestType),
                                "MSPID": "Org1MSP"
                            },
                            "StructureId": "inforequests",
                            "Payload": {
                                "additionalDtls": inBody.requesterId + "|" + inBody.accessPointId,
                                "bookId": inBody.bookingId,
                                "primaryId": inBody.mobIdToken,
                                "reqDate": krypcore.generateDate(inBody.requestDate),
                                "requestId": inBody.requestId,
                                "requestType": inBody.requestType
                            },
                            "sm": 2,
                            "sm_uid": "passengerone",
                            "sm_pwd": "password",
                            "ChainCodeId": "ledger",
                            "ChannelId": "orgchannel"
                        };


                        // Call KrypC inforequests
                        krypcore.invokeAPI('/kc/api/ledgerChainCode/sendMessage', kcReqBody, function(succeed, kcResContent) {

                            console.log("succeed = ", succeed);
                            //console.log("kcResContent = ", kcResContent);

                            if (succeed) {
                                if (kcResContent.Status || kcResContent.status) {

                                    item.sharedAttributes = inBody.attributes;
                                    item.isCompleted = true;
                                    item.isAuthorized = true;

                                    // Temporary store shared information
                                    dbClient.put({
                                        Item: item,
                                        TableName: 'info_request'
                                    }, function(error, data) {
                                        console.log("Result of updating item to info_request:");
                                        console.log(error);
                                        console.log(data);

                                        if (error) {
                                            outBody.errorMessage = error.message;
                                        }
                                        else {
                                            outBody.processingOK = true;
                                        }

                                        callback(outBody);
                                    });

                                }
                                else {
                                    outBody.errorMessage = kcResContent.message;
                                    callback(outBody);
                                }
                            }
                            else {
                                outBody.errorMessage = kcResContent;
                                callback(outBody);
                            }

                        });
                    }

                }

            }
            else {
                outBody.errorMessage = "The request id '" + inBody.requestId + "' has never been registered.";
                callback(outBody);
            }
        }

    });

}

module.exports = {
    process: authorizeInfoRequest
};
