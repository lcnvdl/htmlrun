/** @typedef {import("../interpreter/program-import")} ProgramImport */

const Klass = require("../interpreter/klass");
const KlassMethod = require("../interpreter/klass-method");
const ContextVariable = require("./context-variable");

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

            this.setVariable(imprt.alias, definition, { readOnly: true });
        }
        else {
            this.setVariable(imprt.name, definition, { readOnly: true });
        }
        return this;
    }

    getVariable(name) {
        if (typeof this.variables[name] !== "undefined") {
            return this.variables[name].value;
        }

        return undefined;
    }

    getOrLoadVariable(name) {
        if (typeof this.variables[name] !== "undefined") {
            return this.variables[name].value;
        }

        if (this.modules.some(m => m.alias === name)) {
            throw new Error("Not implemented");
        }
        else {
            throw new Error(`The value ${name} doesn't exists in the current context.`);
        }
    }

    /**
     * @param {string} key Key
     * @param {*} value Value
     * @param {Object} [settings] Settings
     * @param {boolean} [settings.readOnly] Read Only
     */
    setVariable(key, value, settings) {
        const existing = this.variables[key];

        if (existing && existing.readOnly) {
            throw new Error(`The variable ${key} is already declared.`);
        }

        this.variables[key] = new ContextVariable(value, settings);
    }
}

module.exports = Context;