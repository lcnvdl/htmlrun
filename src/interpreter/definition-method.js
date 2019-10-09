class DefinitionMethod {
    constructor(name, description) {
        this.name = name;
        this.description = description || "";
        this.definitions = {};
        this.parameters = [];
    }

    addParameter(name, description) {
        this.parameters.push({
            description,
            name
        });
    }

    addDefinition(engine, code) {
        this.definitions[engine] = code;
    }
}

module.exports = DefinitionMethod;