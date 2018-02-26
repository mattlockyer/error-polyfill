var expect = require("expect.js"),
    sinon = require("sinon"),
    polyfill = require("../.");

describe('Reading the stack trace', function() {

    describe('reading the stack trace of native errors', function() {
        context('when I read the stack trace of a caught native error', function() {
            var aNativeError;
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
            it('should return the formatted stack', function(next) {
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
        });
    });
});