/* eslint-disable no-unused-expressions */
const Program = require("../src/interpreter/program");
const { expect } = require("chai");
const cheerio = require("cheerio");

let program;
let content;

describe("Program", () => {
    beforeEach(() => {
        program = new Program();
    });

    describe("#fill", () => {
        describe("imports", () => {
            it("imports should fail if there is no <ul> or <ol> after the import title", () => {
                let error = null;
                try {
                    content = "<html><body><h1>Imports<h1><p>Importa las cosas</p><ul><li>Log method from <a href='http://test'>System.Console</a></li></ul></body></html>";
                    let $ = cheerio.load(content);
                    const realContent = $("body").html();
                    program.fill(realContent);
                }
                catch (err) {
                    error = err;
                }
                expect(error).to.be.ok;
            });

            it("imports should fail if there is no <a> in the <li> of the <ol>", () => {
                let error = null;
                try {
                    content = "<h1>Imports<h1><ul><li>Log method from System.Console</li></ul>";
                    program.fill(content);
                }
                catch (err) {
                    error = err;
                }
                expect(error).to.be.ok;
            });

            it("imports should fail if the import is repeated", () => {
                let error = null;
                try {
                    content = "<h1>Imports</h1><ul><li>Log from <a href='http://test'>System.Console</a></li><li>Log method from <a href='http://test'>System.Console</a></li></ul>";
                    program.fill(content);
                }
                catch (err) {
                    error = err;
                }
                expect(error).to.be.ok;
            });

            it("imports should fail if the alias type of the import is wrong", () => {
                let error = null;
                try {
                    content = "<h1>Imports</h1><ul><li>Log mmethod from <a href='http://test'>System.Console</a></li></ul>";
                    program.fill(content);
                }
                catch (err) {
                    error = err;
                }
                expect(error).to.be.ok;
            });

            it("import method should work fine", () => {
                content = "<h1>Imports</h1><ul><li>Log method from <a href='http://test'>System.Console</a></li></ul><h1>Otra lista</h1><ul><li>Log method from <a href='http://test'>System.Console</a></li></ul>";
                program.fill(content);
                expect(program.imports.length).to.equal(1);
                expect(program.imports[0].alias).to.equal("Log");
                expect(program.imports[0].name).to.equal("System.Console");
                expect(program.imports[0].url).to.equal("http://test");
            });

            it("import without alias should work fine", () => {
                content = "<h1>Import</h1><ul><li><a href='http://test/1'>System.Console</a></li></ul>";
                program.fill(content);
                expect(program.imports.length).to.equal(1);
                expect(program.imports[0].alias).to.equal("");
                expect(program.imports[0].name).to.equal("System.Console");
                expect(program.imports[0].url).to.equal("http://test/1");
            });

            it("imports method with the text import instad of import should work fine", () => {
                content = "<h1>Import</h1><ul><li>Log method from <a href='http://test'>System.Console</a></li></ul>";
                program.fill(content);
                expect(program.imports.length).to.equal(1);
                expect(program.imports[0].alias).to.equal("Log");
                expect(program.imports[0].name).to.equal("System.Console");
                expect(program.imports[0].url).to.equal("http://test");
            });

            it("duplicated imports should fail", () => {
                content = "<h1>Import</h1><ul><li>Log method from <a href='http://test'>System.Console</a></li><li>Log method from <a href='http://test'>System.Console</a></li></ul>";
                try {
                    program.fill(content);
                }
                catch (err) {
                    expect(err).to.be.ok;
                    return;
                }

                expect(false).to.be.true;
            });

            it("duplicated imports with different url should fail", () => {
                content = "<h1>Import</h1><ul><li>Log method from <a href='http://test/1'>System.Console</a></li><li>Log method from <a href='http://test/2'>System.Console</a></li></ul>";
                try {
                    program.fill(content);
                }
                catch (err) {
                    expect(err).to.be.ok;
                    return;
                }

                expect(false).to.be.true;
            });

            it("imports without link should fail", () => {
                content = "<h1>Import</h1><ul><li>Log method from System.Console</li></ul>";
                try {
                    program.fill(content);
                }
                catch (err) {
                    expect(err).to.be.ok;
                    return;
                }

                expect(false).to.be.true;
            });

            it("imports without text should fail", () => {
                content = "<h1>Import</h1><ul><li>Log method from <a href='system.console'></a></li></ul>";
                try {
                    program.fill(content);
                }
                catch (err) {
                    expect(err).to.be.ok;
                    return;
                }

                expect(false).to.be.true;
            });

            it("imports without href should fail", () => {
                content = "<h1>Import</h1><ul><li>Log method from <a>System.Console</a></li></ul>";
                try {
                    program.fill(content);
                }
                catch (err) {
                    expect(err).to.be.ok;
                    return;
                }

                expect(false).to.be.true;
            });
        });

        describe("instructions", () => {
            it("instructions should ignore comments", () => {
                content = "<h1>Run</h1><ul><li class='comment'>My comment</li><li><u>Log</u> <i>La vida es bella</i></li></ul>";
                program.fill(content);
                expect(program.instructions.length).to.equal(1);
            });

            it("'is an' should generate a set instruction", () => {
                content = "<h1>Run</h1><ul><li><u>Guest</u> is an <i>User</i></li></ul>";
                program.fill(content);
                expect(program.instructions.length).to.equal(1);
                expect(program.instructions[0].name).to.equal("Set");
                expect(program.instructions[0].getArgument(0)).to.equal("Guest");
                expect(program.instructions[0].getArgument(1)).to.equal("=");
                expect(program.instructions[0].getArgument(2)).to.equal("User");
            });

            it("'is a' should generate a set instruction", () => {
                content = "<h1>Run</h1><ul><li><u>Firulais</u> is an <i>Dog</i></li></ul>";
                program.fill(content);
                expect(program.instructions.length).to.equal(1);
                expect(program.instructions[0].name).to.equal("Set");
                expect(program.instructions[0].getArgument(0)).to.equal("Firulais");
                expect(program.instructions[0].getArgument(1)).to.equal("=");
                expect(program.instructions[0].getArgument(2)).to.equal("Dog");
            });

            it("':' should generate a set instruction", () => {
                content = "<h1>Run</h1><ul><li><u>Name</u>: <i>My name</i></li></ul>";
                program.fill(content);
                expect(program.instructions.length).to.equal(1);
                expect(program.instructions[0].name).to.equal("Set");
                expect(program.instructions[0].getArgument(0)).to.equal("Name");
                expect(program.instructions[0].getArgument(1)).to.equal("=");
                expect(program.instructions[0].getArgument(2)).to.equal("My name");
            });

            it("':' in variable name should generate a set instruction", () => {
                content = "<h1>Run</h1><ul><li><u>Name:</u> <i>My name</i></li></ul>";
                program.fill(content);
                expect(program.instructions.length).to.equal(1);
                expect(program.instructions[0].name).to.equal("Set");
                expect(program.instructions[0].getArgument(0)).to.equal("Name");
                expect(program.instructions[0].getArgument(1)).to.equal("=");
                expect(program.instructions[0].getArgument(2)).to.equal("My name");
            });

            it("run without ul should fail", () => {
                content = "<h1>Run</h1><span></span>";
                try {
                    program.fill(content);
                }
                catch (err) {
                    expect(err).to.be.ok;
                    return;
                }

                expect(false).to.be.true;
            });

            it("run should work fine", () => {
                content = "<h1>Run</h1><ul><li><u>Log</u> <i>La vida es bella</i></li></ul>";
                program.fill(content);
                expect(program.instructions.length).to.equal(1);
                expect(program.instructions[0].name).to.equal("Log");
                expect(program.instructions[0].getArgument(0)).to.equal("La vida es bella");
            });

            it("sub instructions should work fine", () => {
                content = "<h2>Run</h2><ul><li><u>Guest</u> is an <u>User</u><ul><li>Name: <i>Locky</i></li><li>E-mail: <i>locky@test.com</i></li></ul></li><li><u>Log</u> <i>Name of Guest</i></li></ul>";
                program.fill(content);
                expect(program.instructions.length).to.equal(2);
                expect(program.instructions[0].children.length).to.equal(2);
                expect(program.instructions[1].children.length).to.equal(0);
            });
        });
    });
});