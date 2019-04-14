// Dependencies
const https = require('https');
const krypcoreAux = require('krypcoreAux.js');

function invokeAPI(reqPath, reqBody, callbackOK, callbackError) {
    console.log('Calling KrypCore ', reqPath);
    
    krypcoreAux.fillReqBody(reqBody);
    console.log(reqBody);

    const reqPostData = JSON.stringify(reqBody);
    const req = https.request({
        hostname: 'org1.krypc.com',
        port: 21001,
        path: reqPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': reqPostData.length
        }
    }, function(res) {
        console.log('Response statusCode: ', res.statusCode);

        var resBody = '';

        res.on('data', function(chunk) {
            resBody += chunk;
        });

        res.on('end', function() {
            console.log('Call completed: ', resBody);
            if (res.statusCode == 200) {
            	console.log('Succeed');
            	const kcResContent = JSON.parse(resBody);
            	if (kcResContent.Status || kcResContent.status) {
                	callbackOK(kcResContent);
            	}
            	else {
            		callbackError(kcResContent.message);
            	}
            }
            else {
            	console.log('Not succeed');
            	callbackError(resBody);
            }
            	
        });

        res.on('error', function(error) {
            console.error('Call failed: ', error);
            callbackError(error);
        });
    });

    req.on('error', function(error) {
        console.error('Error calling KrypCore: ', error.message);
        callbackError(error.message);
    });

    req.setTimeout(10000, function() {
        req.abort();
    });
    req.write(reqPostData);
    req.end();

}


module.exports = {
    invokeAPI: invokeAPI
    generateDate: krypcoreAux.generateDate,
    getRequestTypeUser: krypcoreAux.getRequestTypeUser
};
