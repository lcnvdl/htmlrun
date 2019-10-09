/** @typedef {import("./definition-method")} DefinitionMethod */
/** @typedef {import("./klass-method-argument")} KlassMethodArgument */
const KlassMember = require("./klass-member");

class KlassMethod extends KlassMember {
    /**
     * @param {string} name Name
     * @param {string} visibility Visibility
     * @param {string} description Description
     * @param {KlassMethodArgument[]} parameters Parameters
     */
    constructor(name, visibility, description, parameters) {
        super(name, visibility, description);
        this.parameters = parameters;
        this.definitions = {};
    }

    get hasDefinitions() {
        return Object.keys(this.definitions).length > 0;
    }

    /**
     * @param {DefinitionMethod} definition DefinitionMethod
     */
    applyDefinition(definition) {
        Object.keys(definition.definitions).forEach(key => {
            this.definitions[key] = definition.definitions[key];
        });
    }
}

module.exports = KlassMethod;