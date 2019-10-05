/** @typedef {import('../interpreter/program')} Program */

const Factory = require("../factory");
const Context = require("./context");

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

        for (let i = 0; i < program.imports.length; i++) {
            const imprt = program.imports[i];
            let module = await Factory.createInstance(imprt.url);
            context.addModule(module);
        }

        return context;
    }

}

module.exports = Runtime;