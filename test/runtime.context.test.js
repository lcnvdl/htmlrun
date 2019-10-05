const Context = require("../src/runtime/context");
const { expect } = require("chai");

/** @type {Context} */
let context;

describe("Context", () => {
    beforeEach(() => {
        context = new Context();
    });

    describe("#addModule", () => {
        it("should work fine", () => {
            context.addModule({});
            expect(context.modules.length).to.equal(1);
        });
    });
});