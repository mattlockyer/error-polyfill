var expect = require("expect.js"),
    sinon = require("sinon"),
    polyfill = require("../.");

describe('Formatting the stack trace', function() {

    var newError = function (message) {
        var firstFn = function firstFn() {
            return secondFn();
        };
        var secondFn = function secondFn() {
            return thirdFn();
        };
        var thirdFn = function thirdFn() {
            try {
                throw new Error(message);
            }
            catch (error) {
                return error;
            }
        };
        return firstFn();
    };

    describe('using the default stack trace format', function() {
        context('when I format a stack using the default trace format', function() {
            var error = newError("cause");
            var formattedStack = Error.getStackTrace(error);

            it('should return the same format V8 uses', function(next) {
                expect(typeof(formattedStack)).to.be("string");
                expect(/Error: cause/.test(formattedStack)).to.be.ok();
                var frameStrings = formattedStack.split("\n");
                frameStrings.shift();
                expect(/thirdFn/.test(frameStrings[0])).to.be.ok();
                expect(/secondFn/.test(frameStrings[1])).to.be.ok();
                expect(/firstFn/.test(frameStrings[2])).to.be.ok();
                next();
            });
        });
    });

    describe('using a custom stack trace format', function() {
        context('when I format a stack using a custom trace format', function() {
            var error = newError("cause");
            Error.prepareStackTrace = function (throwable, frames, warnings) {
                return {
                    throwable: throwable,
                    frames: frames,
                    warnings: warnings,
                    toString: function () {
                        return "";
                    }
                };
            };
            var formattedStack = Error.getStackTrace(error);
            delete(Error.prepareStackTrace);
            it('should pass the throwable and the stack frames to the formatter ', function(next) {
                expect(formattedStack.throwable).to.be.an(Error);
                expect(formattedStack.throwable.message).to.be("cause");
                expect(formattedStack.frames).to.be.an(Array);
                expect(/thirdFn/.test(formattedStack.frames[0])).to.be.ok();
                expect(/secondFn/.test(formattedStack.frames[1])).to.be.ok();
                expect(/firstFn/.test(formattedStack.frames[2])).to.be.ok();
                expect(/newError/.test(formattedStack.frames[3])).to.be.ok();
                next();
            });
        });
    });
});