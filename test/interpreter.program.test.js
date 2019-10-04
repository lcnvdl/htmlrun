const Program = require("../src/interpreter/program");
const { expect } = require("chai");
const cheerio = require('cheerio');

let program;
let content;

describe("Program", () => {
    beforeEach(() => {
        program = new Program();
    });

    describe("#fill", () => {
        it("imports should fail if there is no <ul> or <ol> after the import title", () => {
            let error = null;
            try {
                content = "<html><body><h1>Imports<h1><p>Importa las cosas</p><ul><li>Log from <a href='http://test'>System.Console</a></li></ul></body></html>";
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
                content = "<h1>Imports<h1><ul><li>Log from System.Console</li></ul>";
                program.fill(content);
            }
            catch (err) {
                error = err;
            }
            expect(error).to.be.ok;
        });

        it("imports should work fine", () => {
            content = "<h1>Imports</h1><ul><li>Log from <a href='http://test'>System.Console</a></li></ul><h1>Otra lista</h1><ul><li>Log from <a href='http://test'>System.Console</a></li></ul>";
            program.fill(content);
            expect(program.imports.length).to.equal(1);
            expect(program.imports[0].alias).to.equal("Log");
            expect(program.imports[0].name).to.equal("System.Console");
            expect(program.imports[0].url).to.equal("http://test");
        });
    });
});