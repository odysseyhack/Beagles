const forgetme = require('../deploy/funcs/forgetme.js');
const expect = require('chai').expect;

var bodyInputTest = {"mobIdTokenList":["d9513189-8143-4183-a6cf-95f834cadb17"]};

const doResolve = function(outBody) {
    console.log("Finished test is ", outBody.processingOK);
    expect(outBody.processingOK).toBe(true);
};

forgetme.process(bodyInputTest, doResolve);
