"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var commander_1 = require("commander");
var start = function () {
    var program = new commander_1.Command();
    program.requiredOption('-t --test <test>', 'test');
    program.parse(process.argv);
    var options = program.opts();
    console.log("zbay: " + options.test);
};
exports.start = start;
exports.start();
