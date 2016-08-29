var expect = require("expect.js"),
    sinon = require("sinon"),
    polyfill = require("../..");

module.exports = function () {
    var formattedStack;

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

    this.When(/^I format a stack using the default trace format$/, function (next) {
        var error = newError("cause");
        formattedStack = Error.getStackTrace(error);
        next();
    });

    this.Then(/^the result should contain the same format V8 uses$/, function (next) {
        expect(typeof(formattedStack)).to.be("string");
        expect(/Error: cause/.test(formattedStack)).to.be.ok();
        var frameStrings = formattedStack.split("\n");
        frameStrings.shift();
        expect(/thirdFn/.test(frameStrings[0])).to.be.ok();
        expect(/secondFn/.test(frameStrings[1])).to.be.ok();
        expect(/firstFn/.test(frameStrings[2])).to.be.ok();
        next();
    });

    this.When(/^I format a stack using a custom trace format$/, function (next) {
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
        formattedStack = Error.getStackTrace(error);
        delete(Error.prepareStackTrace);
        next();
    });

    this.Then(/^the formatter should get the throwable and the stack frames$/, function (next) {
        expect(formattedStack.throwable).to.be.an(Error);
        expect(formattedStack.throwable.message).to.be("cause");
        expect(formattedStack.frames).to.be.an(Array);
        expect(/thirdFn/.test(formattedStack.frames[0])).to.be.ok();
        expect(/secondFn/.test(formattedStack.frames[1])).to.be.ok();
        expect(/firstFn/.test(formattedStack.frames[2])).to.be.ok();
        expect(/newError/.test(formattedStack.frames[3])).to.be.ok();
        next();
    });

};