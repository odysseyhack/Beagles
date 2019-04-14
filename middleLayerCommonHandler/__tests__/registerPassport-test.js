const registerpassportdetails = require('../deploy/funcs/registerpassportdetails.js');

var bodyInputTest = {
   "issuingCountry" : "US",
   "gender" : "M",
   "age" : 29,
   "requestDate" : "2019-04-08",
   "passportStatus" : "Active",
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
};

registerpassportdetails.process(bodyInputTest, doResolve);
