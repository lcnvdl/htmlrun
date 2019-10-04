const cheerio = require('cheerio');
const HtmlParser = require("./html-parser");
const ProgramImport = require("./program-import");

class Program {
    constructor() {
        this.type = "";
        /** @type {ProgramImport[]} */
        this.imports = [];
        /** @type {[]} */
        this.instructions = [];
    }

    fill(body) {
        const $ = cheerio.load(body);
        const parser = new HtmlParser($);

        let all = $("body > *").toArray();

        all.forEach((e, i) => {

            if (!$(e).is("h1") && !$(e).is("h2") && !$(e).is("h3")) {
                return;
            }

            let text = $(e).text().toLowerCase().trim();
            if (text === "imports" || text === "import") {
                let next = $(all[i + 1]);

                if (!next.is("ul") && !next.is("ol")) {
                    throw new Error("A ul or ol must exists after the import title");
                }

                this._fillImports($, next);
            }
        });
    }

    /**
     * @param {CheerioStatic} $ $
     * @param {CheerioSelector} list OL or UL
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

                if (spl.length !== 3 || spl[1].toLowerCase().trim() !== "from") {
                    throw new Error("Syntax error in import line");
                }

                const alias = spl[0].trim();

                imprt = new ProgramImport(url, name, alias);
            }

            this.imports.push(imprt);
        });
    }
}

module.exports = Program;