const cheerio = require("cheerio");
const HtmlParser = require("./html-parser");
const DefinitionMethod = require("./definition-method");

const sections = ["definitions", "parameters", "behaviour"]

class Definitions {
    constructor() {
        this.methods = {};
    }

    /**
     * @param {string} body Body
     * @param {*} metatags Metatags
     */
    fill(body, metatags) {
        this.metatags = metatags;

        const $ = cheerio.load(body);
        const parser = new HtmlParser($);
        const table = $("table");

        if (table.length === 0) {
            throw new Error("A class definition must be in an html table");
        }

        //  T Head
        let ths = table.find("thead").find("tr").find("th");
        if (ths.length === 0) {
            throw new Error("A class declaration must have its metadata in a thead");
        }

        const methodName = ths.first().text().trim();

        if (!methodName || methodName === "") {
            throw new Error("A method must have a name");
        }

        this.methods[methodName] = new DefinitionMethod(methodName, "");

        //  T Body
        let trs = table.find("tbody").find("tr");
        let section = null;

        for (let i = 0; i < trs.length; i++) {
            let tr = $(trs.get(i));
            let tds = tr.find("td").toArray();

            if (tds.length === 1) {
                let possibleSection = $(tds[0]).text().toLowerCase().trim();
                if (sections.indexOf(possibleSection) === -1) {
                    if (section !== "behaviour") {
                        throw new Error(`Invalid section in the definition file: ${possibleSection}. The valid sections are: ${sections.join(", ")}.`);
                    }

                    this._addBehaviour(methodName, tds[0]);
                }
                else {
                    section = possibleSection;
                }
            }
            else if (tds.length === 2) {
                let [key, value] = parser.getWords(tds);

                if (section === "definitions") {
                    this._addMethodDefinition(methodName, key, value);
                }
                else if (section === "behaviour") {
                    this._addBehaviour(methodName, tds[1]);
                }
                else {
                    this._addParameterDefinition(methodName, key, value);
                }
            }
            else if (tds.length > 2) {
                throw new Error("Invalid row: it must have two columns.");
            }
        }
    }

    _addBehaviour(methodName, parent) {
        const items = $(parent).find("ol").children();

        items.forEach(item => {
            this.methods[methodName].addBehaviour(item);
        });
    }

    _addMethodDefinition(methodName, key, value) {
        this.methods[methodName].addDefinition(key, value);
    }

    _addParameterDefinition(methodName, key, value) {
        this.methods[methodName].addParameter(key, value);
    }
}

module.exports = Definitions;