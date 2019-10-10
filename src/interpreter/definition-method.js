const cheerio = require("cheerio");

class DefinitionMethod {
    constructor(name, description) {
        this.name = name;
        this.description = description || "";
        this.definitions = {};
        this.parameters = [];
        this.behaviour = [];
    }

    /**
     * @param {string} linea <li> content
     */
    addBehaviour(linea) {
        const $ = cheerio.load(linea.trim());
        throw new Error("Not implemented");
    }

    /**
     * @param {*} name Name
     * @param {*} description Description
     */
    addParameter(name, description) {
        this.parameters.push({
            description,
            name
        });
    }

    /**
     * @param {string} engine Engine
     * @param {string} code Code
     */
    addDefinition(engine, code) {
        this.definitions[engine] = code;
    }
}

module.exports = DefinitionMethod;