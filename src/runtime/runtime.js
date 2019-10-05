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

        settings = settings || {};

        for (let i = 0; i < program.imports.length; i++) {
            const imprt = program.imports[i];
            let mod = await Factory.createInstance(imprt.url, settings.workingDirectory);
            context.addModule(mod);
        }

        return context;
    }

}

module.exports = Runtime;
