// Dependencies
const https = require('https');

function invokeAPI(reqPath, reqBody, callback) {
    console.log('Calling KrypCore ', reqPath);
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
            callback(res.statusCode == 200, JSON.parse(resBody));
        });

        res.on('error', function(error) {
            console.error('Call failed: ', error);
            callback(false, error);
        });
    });

    req.on('error', function(error) {
        console.error('Error calling KrypCore: ', error.message);
        callback(false, error.message);
    });

    req.setTimeout(10000, function() {
        req.abort();
    });
    req.write(reqPostData);
    req.end();

}


function generateDate(sDate) {
    var dDate;
    if (sDate == null || sDate == "") {
        dDate = new Date();
    }
    else {
        dDate = new Date(sDate);
    }
    var y = dDate.getFullYear();
    var m = "0" + (dDate.getMonth() + 1);
    m = m.substring(m.length - 2);
    var d = "0" + (dDate.getDate() + 1);
    d = d.substring(d.length - 2);
    return {
        "cvalue": y + "-" + m + "-" + d + " 00:00:00",
        "format": "02-01-2006",
        "value": d + "-" + m + "-" + y
    };
}

function getRequestTypeUser(requestType) {
    switch (requestType) {
        case "AirportEntry":
            return "schipholaccesscontrol";
        case "BorderControl":
            return "nlborderpatrol";
        case "LoungeEntry":
            return "loungeuser1";
        case "Shopping":
            return "retailshop1";
        case "Parking":
            return "schipholparking";
        case "Booking":
            return "klmticketing";
    }
    return "loungeuser1"; // default
}

module.exports = {
    invokeAPI: invokeAPI,
    generateDate: generateDate,
    getRequestTypeUser: getRequestTypeUser
};
