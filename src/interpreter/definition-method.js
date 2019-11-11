/** @typedef {import("./program-instruction")} ProgramInstruction */

class DefinitionMethod {
    constructor(name, description) {
        this.name = name;
        this.description = description || "";
        this.definitions = {};
        this.parameters = [];
        this.behaviour = [];
    }

    /**
     * @param {ProgramInstruction} instruction ProgramInstruction
     */
    addBehaviour(instruction) {
        this.behaviour.push(instruction);
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