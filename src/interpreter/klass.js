const cheerio = require('cheerio');
const HtmlParser = require("./html-parser");

class Klass {
    constructor() {
        this.name = "";
        this.parent = "";
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
    }

    static isValidClassName(n) {
        return n && n !== "";
    }
}

module.exports = Klass;