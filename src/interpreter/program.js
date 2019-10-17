const cheerio = require("cheerio");
const HtmlParser = require("./html-parser");
const ProgramImport = require("./program-import");
const ProgramInstruction = require("./program-instruction");

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
        list.children("li").each((i, e) => {
            let li = $(e);
            if (li.text().trim() === "" || li.hasClass("comment")) {
                return;
            }

            const parser = new HtmlParser($);

            let subInstructionsList = li.find("ul").length > 0 ? li.find("ul") : li.find("ol");

            if (subInstructionsList && subInstructionsList.length > 0) {

                let aux = $(subInstructionsList.html());
                
                subInstructionsList.remove();

                // li = li.remove("ul").remove("ol");

                subInstructionsList = aux;

                if (li.html().indexOf("<ol>") !== -1 || li.html().indexOf("<ul>") !== -1) {
                    throw new Error("Cannot clean children instructions");
                }
            }

            const words = parser.getChildrenWords(li);
            let instruction = new ProgramInstruction().fromArray(words);

            if (subInstructionsList && subInstructionsList.length > 0) {
                instruction.children = this._getSubInstructions($, subInstructionsList);
            }

            this.instructions.push(instruction);
        });
    }

    /**
     * @param {CheerioStatic} $ $
     * @param {CheerioSelector} list <ol> or <ul>
     */
    _getSubInstructions($, subInstructionsList) {
        /** @type {ProgramInstruction[]} */
        let subInstructions = [];

        const parser = new HtmlParser($);

        subInstructionsList.children().toArray().forEach(element => {
            const li = $(element);
            const words = parser.getChildrenWords(li);
            let instruction = new ProgramInstruction().fromArray(words);
            subInstructions.push(instruction);
        });

        return subInstructions;
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