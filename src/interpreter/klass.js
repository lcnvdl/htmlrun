/** @typedef {import("./definitions")} Definitions */

const cheerio = require("cheerio");
const HtmlParser = require("./html-parser");
const KlassMethod = require("./klass-method");
const KlassMethodArgument = require("./klass-method-argument");
const KlassAttribute = require("./klass-attribute");

class Klass {
    constructor() {
        this.name = "";
        this.parent = "";

        this.metatags = {};

        /** @type {KlassAttribute[]} */
        this.attributes = [];
        /** @type {KlassMethod[]} */
        this.methods = [];
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
            throw new Error("A class declaration must be in an html table");
        }

        //  T Head
        let ths = table.find("thead").find("tr").find("th");
        if (ths.length === 0) {
            throw new Error("A class declaration must have its metadata in a thead");
        }

        let name = ths.first().text().trim();

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
            let tds = tr.find("td").toArray();

            if (tds.length === 1) {
                let possibleSection = $(tds[0]).text().toLowerCase().trim();
                if (possibleSection !== "attributes" && possibleSection !== "methods") {
                    throw new Error(`Invalid section in class ${this.name}: ${possibleSection}`);
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

    hasMethod(name) {
        return this.methods.some(m => m.name === name);
    }

    getMethod(name) {
        return this.methods.find(m => m.name === name);
    }

    addDefinition(definition) {
        definition.methods.forEach(method => {
            if (!this.hasMethod(method.name)) {
                throw new Error(`Undeclared method: ${method.name}`);
            }

            this.getMethod(method.name).definitions = method.definitions;
        });
    }

    /**
     * @param {Definitions} definitions Definitions
     */
    applyDefinitions(definitions) {
        this.methods.forEach(method => {
            let methodDefinition = definitions.methods[method.name];
            if (!methodDefinition) {
                throw new Error(`Definition not found for method "${method.name}"`);
            }

            method.applyDefinition(methodDefinition);
        });
    }

    _addMethodDeclaration(declaration, description) {
        if (["+", "-", "~"].indexOf(declaration[0]) === -1) {
            throw new Error(`Visibility not specified for method in class ${this.name}`);
        }

        const visibility = declaration[0];

        declaration = declaration.substr(1).trim();

        let params = "";

        if (declaration.indexOf("(") !== -1) {
            params = declaration.substr(declaration.indexOf("(") + 1);
            params = params.substr(0, params.indexOf(")"));
            declaration = declaration.substr(0, declaration.indexOf("(")).trim();
        }

        const name = declaration;
        const parameters = params.split(",").map(m => new KlassMethodArgument(m.trim()));

        const method = new KlassMethod(name, visibility, description, parameters);
        this.methods.push(method);
    }

    _addAttributeDeclaration(declaration, description) {
        if (["+", "-", "~"].indexOf(declaration[0]) === -1) {
            throw new Error(`Visibility not specified for method in class ${this.name}`);
        }

        const visibility = declaration[0];

        declaration = declaration.substr(1).trim();

        const name = declaration;

        const attribute = new KlassAttribute(name, visibility, description);
        this.attributes.push(attribute);
    }

    static isValidClassName(n) {
        return n && n !== "";
    }
}

module.exports = Klass;