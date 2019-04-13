exports.handler = async(event, context) => {

    console.log("Start processing middleLayer call");
    console.log(event);
    //console.log(context);

    return new Promise(function(resolve, reject) {

        const doResolve = function(outBody) {
            console.log("Finished processing ", event.resource);
            console.log("outBody = ", outBody);
            
            resolve({
                statusCode: 200,
                body: JSON.stringify(outBody),
                isBase64Encoded: false,
                headers: {}
            });
        };

        switch (event.resource) {
            case "/authorizeinforequest":
                const authorizeinforequest = require('./funcs/authorizeinforequest.js');
                authorizeinforequest.process(JSON.parse(event.body), doResolve);
                break;
            case "/gettransactionreport":
                const gettransactionreport = require('./funcs/gettransactionreport.js');
                gettransactionreport.process(event.queryStringParameters, doResolve);
                break;
            case "/getwalletstatus":
                const getwalletstatus = require('./funcs/getwalletstatus.js');
                getwalletstatus.process(event.queryStringParameters, doResolve);
                break;
            case "/isinforequestauthorized":
                const isinforequestauthorized = require('./funcs/isinforequestauthorized.js');
                isinforequestauthorized.process(event.queryStringParameters, doResolve);
                break;
            case "/registerinforequest":
                const registerinforequest = require('./funcs/registerinforequest.js');
                registerinforequest.process(JSON.parse(event.body), doResolve);
                break;
            case "/registerpassportdetails":
                const registerpassportdetails = require('./funcs/registerpassportdetails.js');
                registerpassportdetails.process(JSON.parse(event.body), doResolve);
                break;
            case "/registertraveldetails":
                const registertraveldetails = require('./funcs/registertraveldetails.js');
                registertraveldetails.process(JSON.parse(event.body), doResolve);
                break;
            case "/forgetme":
                const forgetme = require('./funcs/forgetme.js');
                forgetme.process(JSON.parse(event.body), doResolve);
                break;
            default:
                reject("Unknown resource " + event.resource);
        }
    });

};
