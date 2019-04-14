// Dependencies
const AWS = require('aws-sdk');
const dbClient = new AWS.DynamoDB.DocumentClient({
	region : 'eu-central-1'
});

function storeRequest(requestItem, callbackOK, callbackError) {
	dbClient.put({
		Item : requestItem,
		TableName : 'info_request'
	}, function(error, data) {
		console.log("Result of getting item from info_request:");
		console.log(error);
		console.log(data);
		if (error) {
			callbackError(error.message);
		} else {
			callbackOK();
		}
	});
}

function getRequest(requestId, callbackOK, callbackError) {
	dbClient.get({
		Key : {
			"requestId" : requestId
		},
		TableName : 'info_request'
	}, function(error, data) {
		console.log("Result of adding item to info_request:");
		console.log(error);
		console.log(data);
		if (error) {
			callbackError(error.message);
		} else {
			if (data.Item != null) {
				callbackOK(data.Item);
			} else {
				callbackError("The request id '" + inBody.requestId
						+ "' has never been registered.");
			}
		}
	});
}

module.exports = {
	storeRequest : storeRequest,
	getRequest : getRequest
};
