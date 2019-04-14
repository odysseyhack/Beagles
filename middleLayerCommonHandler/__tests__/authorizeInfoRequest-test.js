const authorizeinforequest = require('../deploy/funcs/authorizeinforequest.js');
const expect = require('chai').expect;

var bodyInputTest = {
		   "mobIdToken" : "9c7caf4f-cfa5-4ebe-908e-95d0ce009e92",
		   "requestId" : "940ea529-0a96-4dbc-9423-b5969f97cc43",
		   "requesterId" : "KLM",
		   "accessPointId" : "Entry99",
		   "requestDate" : "2019-04-08",
		   "requestType" : "AirportEntry",
		   "bookingId" : "KL01915",
		   "attributes" : [
		      {
		         "name" : "first_name",
		         "value" : "John",
		         "hash" : "AAABBB",
		         "signature" : "1234ABC",
		         "isEncodedBase64" : false
		      }
		   ]
		};

const doResolve = function(outBody) {
    console.log("Finished test is ", outBody.processingOK);
    expect(outBody.processingOK).toBe(true);
};

authorizeinforequest.process(bodyInputTest, doResolve);
