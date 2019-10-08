/* eslint-disable no-eval */
/** @typedef {import('../interpreter/program')} Program */

const Factory = require("../factory");
const Context = require("./context");
const KlassMethod = require("../interpreter/klass-method");

class Runtime {

    constructor() {
    }

    /**
     * @param {Program} program Program
     * @param {[]} args Arguments
     * @param {*} settings Settings
     * @returns {Promise<Context>} Context
     */
    async createContext(program, args, settings) {
        let context = new Context(program, args);

        settings = settings || {};

        for (let i = 0; i < program.imports.length; i++) {
            const imprt = program.imports[i];
            let mod = await Factory.createInstance(imprt.url, settings.workingDirectory);
            context.addModule(imprt, mod);
        }

        return context;
    }

    /**
     * @param {Context} context Context
     */
    run(context) {
        if (!context.program) {
            throw new Error("The context is not a program");
        }

        let instructions = context.program.instructions;
        /** @type {[]} */
        let current;

        while (instructions.length > 0) {
            current = instructions.pop();

            const name = current[0];
            let variable = context.getOrLoadVariable(name);
            if (variable instanceof KlassMethod) {
                /** @type {KlassMethod} */
                const method = variable;
                let definition = method.definitions["node"];

                if (!definition) {
                    throw new Error(`The method ${name} is declared but not defined.`);
                }

                current.forEach((m, i) => {
                    if (i > 0) {
                        const param = method.parameters[i - 1];
                        if (!param) {
                            throw new Error(`Wrong number of parameters calling the method ${name}`);
                        }
                        
                        definition = definition.replace(param.name, `"${m}"`);
                    }
                });

                let global = context.variables;

                eval(`${definition}`);

                context.variables = global;
            }
            else {
                throw new Error("Not implemented");
            }
        }
    }
}

module.exports = Runtime;
