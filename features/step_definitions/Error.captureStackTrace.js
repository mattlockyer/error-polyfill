var expect = require("expect.js"),
    sinon = require("sinon"),
    polyfill = require("../..");

module.exports = function () {
    var aThrowable;

    this.When(/^I write the stack trace onto a throwable$/, function (next) {
        aThrowable = {
            name: "Throwable",
            message: "some text"
        };
        var firstFn = function firstFn() {
            secondFn();
        };
        var secondFn = function secondFn() {
            thirdFn();
        };
        var thirdFn = function thirdFn() {
            Error.captureStackTrace(aThrowable);

        };
        firstFn();
        next();
    });

    this.Then(/^the throwable should store information about the present stack$/, function (next) {
        expect(Error.getStackTrace(aThrowable)).to.not.be(undefined);
        next();
    });

    this.Then(/^by reading this information the result should be the formatted stack$/, function (next) {
        var stackString = Error.getStackTrace(aThrowable);
        expect(typeof(stackString)).to.be("string");
        expect(/Throwable: some text/.test(stackString)).to.be.ok();
        var frameStrings = stackString.split("\n");
        frameStrings.shift();
        expect(/thirdFn/.test(frameStrings[0])).to.be.ok();
        expect(/secondFn/.test(frameStrings[1])).to.be.ok();
        expect(/firstFn/.test(frameStrings[2])).to.be.ok();
        next();
    });

    this.When(/^I write the stack trace onto a throwable and pass a terminator function along$/, function (next) {
        aThrowable = {
            name: "Throwable",
            message: "some text"
        };
        var firstFn = function firstFn() {
            secondFn();
        };
        var secondFn = function secondFn() {
            thirdFn();
        };
        var thirdFn = function thirdFn() {
            Error.captureStackTrace(aThrowable, thirdFn);
        };
        firstFn();
        next();
    });

    this.Then(/^the throwable should store the information about the part of the present stack happened before the terminator function call$/, function (next) {
        expect(Error.getStackTrace(aThrowable)).to.not.be(undefined);
        next();
    });

    this.Then(/^by reading this information the result should be the formatted stack without the omitted frames$/, function (next) {
        var stackString = Error.getStackTrace(aThrowable);
        expect(typeof(stackString)).to.be("string");
        expect(/Throwable: some text/.test(stackString)).to.be.ok();
        var frameStrings = stackString.split("\n");
        frameStrings.shift();
        expect(/secondFn/.test(frameStrings[0])).to.be.ok();
        expect(/firstFn/.test(frameStrings[1])).to.be.ok();
        next();
    });

};