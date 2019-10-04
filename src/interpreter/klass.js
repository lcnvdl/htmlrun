const cheerio = require('cheerio');
const HtmlParser = require("./html-parser");
const KlassMethod = require("./klass-method");
const KlassAttribute = require("./klass-attribute");

class Klass {
    constructor() {
        this.name = "";
        this.parent = "";

        /** @type {KlassAttribute[]} */
        this.attributes = [];
        /** @type {KlassMethod[]} */
        this.methods = [];
    }

    /**
     * @param {string} body Body
     */
    fill(body) {
        const $ = cheerio.load(body);
        const parser = new HtmlParser($);
        const table = $("table");

        if (table.length === 0) {
            throw new Error("A class definition must be in an html table");
        }

        let ths = table.find("thead").find("tr").find("th");
        if (ths.length === 0) {
            throw new Error("A class definition must have its metadata in a thead");
        }

        //  T Head
        let name = ths.first().text();

        this.name = name;

        if (!this.name || this.name === "") {
            throw new Error("A class must have a name");
        }

        for (let i = 1; i < ths.length; i++) {
            let th = $(ths.get(i));
            let words = parser.getChildrenWords(th);

            if (words[0] === "extends") {
                this.parent = words[1];

                if (!Klass.isValidClassName(this.parent)) {
                    throw new Error("Invalid parent name");
                }
            }
        }

        //  T Body
        let trs = table.find("tbody").find("tr");
        let section = null;

        for (let i = 0; i < trs.length; i++) {
            let tr = $(trs.get(i));
            let tds = tr.find("td");

            if (tds.length === 1) {
                let possibleSection = tds.first().text().toLowerCase().trim();
                if (possibleSection !== "attributes" && possibleSection !== "methods") {
                    throw new Error(`Invalid section: ${possibleSection}`);
                }

                section = possibleSection;
            }
            else if (tds.length === 2) {
                let [declaration, description] = parser.getWords(tds);

                if (section === "methods") {
                    this._addMethodDeclaration(declaration, description);
                }
                else {
                    this._addAttributeDeclaration(declaration, description);
                }
            }
            else if (tds.length > 2) {
                throw new Error("Invalid row: it must have two columns.");
            }
        }
    }

    _addMethodDeclaration(declaration, description) {
        throw new Error("Not implemented");
    }

    _addAttributeDeclaration(declaration, description) {
        throw new Error("Not implemented");
    }

    static isValidClassName(n) {
        return n && n !== "";
    }
}

module.exports = Klass;