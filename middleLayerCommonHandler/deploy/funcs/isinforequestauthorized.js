// Dependencies
const storage = require('../storage.js');


function isInfoRequestAuthorized(inParams, callback) {
    console.log("isInfoRequestAuthorized");
    console.log("requestId = ", inParams.requestId);

    const outBody = {
            isCompleted: false,
            isAuthorized: false,
            attributes: null,
            errorMessage: null
        };
    
    storage.getRequest(inParams.requestId, function(item) {
        if (item.isCompleted) {
            outBody.isCompleted = true;
            outBody.isAuthorized = item.isAuthorized == true;
            outBody.attributes = item.sharedAttributes;
        }
        callback(outBody);
    }, function(errorMessage) {
        outBody.errorMessage = errorMessage;
        callback(outBody);
    });
}

module.exports = {
    process: isInfoRequestAuthorized
};
