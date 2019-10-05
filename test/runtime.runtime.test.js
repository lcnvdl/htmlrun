/** @typedef {import("../src/interpreter/program")} Program */
const Runtime = require("../src/runtime/runtime");
const Factory = require("../src/factory");
const { expect } = require("chai");

/** @type {Runtime} */
let runtime;
/** @type {Program} */
let program;

describe("Runtime", () => {
    beforeEach(async () => {
        runtime = new Runtime();
        program = await Factory.createInstance("../examples/01-hello-world.html", __dirname);
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
        it("should work fine", async () => {
            const ctx = await runtime.createContext(program, [], {});
            expect(ctx).to.be.ok;
        });
    });
});