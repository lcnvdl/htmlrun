/* eslint-disable no-unused-expressions */
/** @typedef {import("../src/interpreter/program")} Program */
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
        it("should work fine", async () => {
            const ctx = await runtime.createContext(program, [], { workingDirectory: folder });
            expect(ctx).to.be.ok;
            expect(ctx.modules.length).to.equal(1);
        });
    });
});