const cheerio = require("cheerio");
const HtmlParser = require("./html-parser");
const ProgramImport = require("./program-import");
const InstructionParser = require("./instruction-parser");

class Program {
    constructor() {
        this.type = "";
        /** @type {ProgramImport[]} */
        this.imports = [];
        /** @type {[]} */
        this.instructions = [];
    }

    fill(body, metatags) {
        const $ = cheerio.load(body);

        let all = $("body > *").toArray();

        this.type = (metatags ? metatags.runtime : null) || "console";

        all.forEach((e, i) => {
            if (!$(e).is("h1") && !$(e).is("h2") && !$(e).is("h3")) {
                return;
            }

            let text = $(e).text().toLowerCase().trim();
            if (text === "imports" || text === "import") {
                let next = $(all[i + 1]);

                if (!next.is("ul") && !next.is("ol")) {
                    throw new Error(`An <ul> or <ol> must exists after the ${text} title`);
                }

                this._fillImports($, next);
            }
            else if (text === "run" || text === "instructions") {
                let next = $(all[i + 1]);

                if (!next.is("ul") && !next.is("ol")) {
                    throw new Error(`An <ul> or <ol> must exists after the ${text} title`);
                }

                this._fillInstructions($, next);
            }
        });
    }

    /**
     * @param {CheerioStatic} $ $
     * @param {CheerioSelector} list <ol> or <ul>
     */
    _fillInstructions($, list) {
        const parser = new InstructionParser($);
        parser.getInstructions(list).forEach(m => this.instructions.push(m));
    }

    /**
     * @param {CheerioStatic} $ $
     * @param {CheerioSelector} list <ol> or <ul>
     */
    _fillImports($, list) {
        list.children("li").each((i, e) => {
            const li = $(e);
            const link = $(li.find("a"));
            if (!link || link.length === 0) {
                throw new Error("Link element not found");
            }

            const url = link.attr("href");
            if (!url || url === "") {
                throw new Error("Empty href in the import");
            }

            const name = link.text();
            if (!name || name === "") {
                throw new Error("Empty name in the import");
            }

            const text = li.text();
            let imprt;

            if (text === link.text()) {
                //  Import without alias
                imprt = new ProgramImport(url, name, null);
            }
            else {
                //  Import with alias
                const parser = new HtmlParser($);
                const spl = parser.limitSpaces(text).trim().split(" ");

                const aliasTypes = ["method", "class"];

                if (spl.length !== 4 || spl[2].toLowerCase().trim() !== "from") {
                    throw new Error("Syntax error in import line");
                }

                const aliasType = spl[1].toLowerCase().trim();
                if (aliasTypes.indexOf(aliasType) === -1) {
                    throw new Error(`Invalid alias type: ${aliasType}`);
                }

                const alias = spl[0].trim();

                imprt = new ProgramImport(url, name, alias, aliasType);
            }

            if (this.imports.some(m => (m.name === imprt.name && m.alias === imprt.alias) || (m.name === imprt.name && m.url !== imprt.url))) {
                throw new Error("Duplicated imports");
            }

            this.imports.push(imprt);
        });
    }
}

module.exports = Program;