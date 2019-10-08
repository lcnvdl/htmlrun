/** @typedef {import("../interpreter/program-import")} ProgramImport */

const Klass = require("../interpreter/klass");
const KlassMethod = require("../interpreter/klass-method");

class Context {
    constructor(program, args) {
        this.modules = [];
        this.program = program;
        this.arguments = args;
        this.variables = {};
    }

    /**
     * @param {ProgramImport} imprt
     * @param {*} definition 
     */
    addModule(imprt, definition) {
        this.modules.push(imprt);
        if (imprt.alias && imprt.alias !== "") {
            if (imprt.aliasType === "method") {
                if (definition instanceof Klass) {
                    /** @type {Klass} */
                    let klass = definition;
                    definition = klass.getMethod(imprt.alias);
                    if (!definition) {
                        throw new Error(`Missing method ${imprt.alias} in class ${klass.name}.`);
                    }
                }
                else if (!(definition instanceof KlassMethod)) {
                    throw new Error("Invalid error parsing the imported file.");
                }
            }

            this.variables[imprt.alias] = definition;
        }
        else {
            this.variables[imprt.name] = definition;
        }
        return this;
    }

    getOrLoadVariable(name) {
        if (typeof this.variables[name] !== "undefined") {
            return this.variables[name];
        }

        if (this.modules.some(m => m.alias === name)) {
            throw new Error("Not implemented");
        }
        else {
            throw new Error(`The value ${name} doesn't exists in the current context.`);
        }
    }
}

module.exports = Context;