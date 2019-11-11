/* eslint-disable no-unused-expressions */
/** @typedef {import("../src/interpreter/program")} Program */
const Context = require("../src/runtime/context");
const Runtime = require("../src/runtime/runtime");
const Factory = require("../src/factory");
const { expect } = require("chai");
const path = require("path");

/** @type {Runtime} */
let runtime;
/** @type {Program} */
let program;
/** @type {string} */
let folder;

describe("Runtime", () => {
    beforeEach(async () => {
        runtime = new Runtime();
        folder = path.join(__dirname, "../examples");
        program = await Factory.createInstance("./01-hello-world.html", folder);
    });

    describe("#preparation", () => {
        it("should work fine", () => {
            expect(runtime).to.be.ok;
            expect(program).to.be.ok;
            expect(program.instructions).to.be.ok;
            expect(program.type).to.be.ok;
        });
    });

    describe("#createContext", () => {
        it("should fail if the method required in class method importation doesn't exists", async () => {
            const fprogram = await Factory.createInstance("./test-programs/runtime.context-createContext-1.html", __dirname);
            let error = null;
            try {
                await runtime.createContext(fprogram, [], { workingDirectory: folder });
            }
            catch (err) {
                error = err;
            }

            expect(error).to.be.ok;
        });

        it("should work fine", async () => {
            const ctx = await runtime.createContext(program, [], { workingDirectory: folder });
            expect(ctx).to.be.ok;
            expect(ctx.modules.length).to.equal(1);
        });
    });

    describe("#run", () => {
        it("should fail if context doesn't have a program work fine", () => {
            let error = null;
            try {
                const ctx = new Context();
                runtime.run(ctx);
            }
            catch (err) {
                error = err;
            }

            expect(error).to.be.ok;
        });

        it("should work fine", async () => {
            const ctx = await runtime.createContext(program, [], { workingDirectory: folder });
            expect(ctx.variables.Log).to.be.ok;
            ctx.getVariable("Log").definitions.node = "global.result = 100;";
            runtime.run(ctx);
            expect(ctx.variables.result).to.equal(100);
        });
    });
});