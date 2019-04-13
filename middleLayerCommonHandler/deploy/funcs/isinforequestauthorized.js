// Dependencies
const AWS = require('aws-sdk');


function isInfoRequestAuthorized(inParams, callback) {
    console.log("isInfoRequestAuthorized");
    console.log("requestId = ", inParams.requestId);

    const dbClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });

    dbClient.get({
        Key: {
            "requestId": inParams.requestId
        },
        TableName: 'info_request'
    }, function(error, data) {
        console.log("Result of getting item from info_request:");
        console.log(error);
        console.log(data);

        const outBody = {
            isCompleted: false,
            isAuthorized: false,
            attributes: null,
            errorMessage: null
        };

        if (error) {
            outBody.errorMessage = error.message;
        }
        else {
            const item = data.Item;
            if (item != null) {
                if (item.isCompleted) {
                    outBody.isCompleted = true;
                    outBody.isAuthorized = item.isAuthorized == true;
                    outBody.attributes = item.sharedAttributes;
                }
            }
            else {
                outBody.errorMessage = "The request id '" + inParams.requestId + "' has never been registered.";
            }
        }

        callback(outBody);
    });
}

module.exports = {
    process: isInfoRequestAuthorized
};
