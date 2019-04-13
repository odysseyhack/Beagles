// Dependencies
const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');


function registerInfoRequest(inBody, callback) {
    console.log("registerInfoRequest");

    const dbClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });

    // Generate request id
    const requestId = uuidv4();

    dbClient.put({
        Item: {
            requestId: requestId,
            requestData: inBody,
            isCompleted: false,
            isAuthorized: false
        },
        TableName: 'info_request'
    }, function(error, data) {
        console.log("Result of adding item to info_request:");
        console.log(error);
        console.log(data);

        const outBody = {
            registrationOK: false,
            requestId: null,
            errorMessage: null
        };

        if (error) {
            outBody.errorMessage = error.message;
        }
        else {
            outBody.registrationOK = true;
            outBody.requestId = requestId;
        }

        callback(outBody);
    });
}

module.exports = {
    process: registerInfoRequest
};
