/* eslint-disable no-unused-expressions */
const cheerio = require("cheerio");
const InstructionParser = require("../src/interpreter/instruction-parser");
const { expect } = require("chai");

let $;
let parser;

describe("InstructionParser", () => {
    beforeEach(() => {
        $ = cheerio.load("<html><body><li></li></body></html>");
        parser = new InstructionParser($);
    });

    it("get instruction should work fine", () => {
        const li = $("li");
        const result = parser.getInstruction(li);
        expect(result).to.be.ok;
    });
});