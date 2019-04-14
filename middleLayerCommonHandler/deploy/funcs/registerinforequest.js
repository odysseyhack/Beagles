// Dependencies
const uuidv4 = require('uuid/v4');
const storage = require('../storage.js');

function registerInfoRequest(inBody, callback) {
    console.log("registerInfoRequest");

    // Generate request id
    const requestId = uuidv4();

    const outBody = {
        registrationOK: false,
        requestId: null,
        errorMessage: null
    };

    storage.storeRequest({
        requestId: requestId,
        requestData: inBody,
        isCompleted: false,
        isAuthorized: false
    }, function() {
        outBody.registrationOK = true;
        outBody.requestId = requestId;
        callback(outBody);
    }, function(errorMessage) {
        outBody.errorMessage = errorMessage;
        callback(outBody);
    });
}

module.exports = {
    process: registerInfoRequest
};
