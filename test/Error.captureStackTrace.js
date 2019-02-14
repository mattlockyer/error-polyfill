var expect = require("expect.js"),
    sinon = require("sinon"),
    polyfill = require("../.");

describe('Capturing the stack trace', function () {

    describe('writing the current stack trace on throwables', function () {
        context('when I write the stack trace onto a throwable', function () {
            var aThrowable = {
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

            it('should store information about the present stack', function (next) {
                expect(Error.getStackTrace(aThrowable)).to.not.be(undefined);
                next();
            });
            it('should return the formatted stack by reading this information', function (next) {
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
        });
    });

    describe('omitting frames by writing the current stack trace', function () {
        context('when I write the stack trace onto a throwable and pass a terminator function along', function () {
            var aThrowable = {
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
            it('should store the information about the part of the present stack happened before the terminator function call', function (next) {
                expect(Error.getStackTrace(aThrowable)).to.not.be(undefined);
                next();
            });
            it('should return the formatted stack without the omitted frames by reading this information', function (next) {
                var stackString = Error.getStackTrace(aThrowable);
                expect(typeof(stackString)).to.be("string");
                expect(/Throwable: some text/.test(stackString)).to.be.ok();
                var frameStrings = stackString.split("\n");
                frameStrings.shift();
                expect(/secondFn/.test(frameStrings[0])).to.be.ok();
                expect(/firstFn/.test(frameStrings[1])).to.be.ok();
                next();
            });
        });

        context('when I write the stack trace onto a throwable and pass a strict mode terminator function along', function () {
            var aThrowable = {
                name: "Throwable",
                message: "some text"
            };
            var firstFn = function firstFn() {
                secondFn();
            };
            var secondFn = function secondFn() {
                thirdFn();
            };
            var thirdFn = (function () {
                'use strict';
                return function thirdFn() {
                    Error.captureStackTrace(aThrowable, thirdFn);
                };
            })();

            firstFn();
            it('should store the information about the part of the present stack happened before the terminator function call', function (next) {
                expect(Error.getStackTrace(aThrowable)).to.not.be(undefined);
                next();
            });
            it('should return the formatted stack without the omitted frames by reading this information', function (next) {
                var stackString = Error.getStackTrace(aThrowable);
                expect(typeof(stackString)).to.be("string");
                expect(/Throwable: some text/.test(stackString)).to.be.ok();
                var frameStrings = stackString.split("\n");
                frameStrings.shift();
                expect(/secondFn/.test(frameStrings[0])).to.be.ok();
                expect(/firstFn/.test(frameStrings[1])).to.be.ok();
                next();
            });
        });
    });
});