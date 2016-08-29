var expect = require("expect.js"),
    sinon = require("sinon"),
    polyfill = require("../..");

module.exports = function () {
    var a;

    this.When(/^a$/, function (next) {
        a = 1;
        next();
    });

    this.Then(/^b$/, function (next) {
        expect(a).to.be.ok();
        next();
    });

};