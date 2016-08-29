var expect = require("expect.js"),
    sinon = require("sinon"),
    polyfill = require("../..");

module.exports = function () {
    var aNativeError;

    this.When(/^I read the stack trace of a caught native error$/, function (next) {
        var firstFn = function firstFn() {
            secondFn();
        };
        var secondFn = function secondFn() {
            thirdFn();
        };
        var thirdFn = function thirdFn() {
            try {
                theNotDefinedFunction();
            }
            catch (error) {
                aNativeError = error;
            }
        };
        firstFn();
        next();
    });

    this.Then(/^the result should be the formatted stack$/, function (next) {
        var stackString = Error.getStackTrace(aNativeError);
        expect(typeof(stackString)).to.be("string");
        expect(/ReferenceError.*theNotDefinedFunction/.test(stackString)).to.be.ok();
        var frameStrings = stackString.split("\n");
        frameStrings.shift();
        expect(/thirdFn/.test(frameStrings[0])).to.be.ok();
        expect(/secondFn/.test(frameStrings[1])).to.be.ok();
        expect(/firstFn/.test(frameStrings[2])).to.be.ok();
        next();
    });

};