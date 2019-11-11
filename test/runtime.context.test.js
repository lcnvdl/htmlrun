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

    describe("#setVariable", () => {
        it("should not fail if a writeable variable already exists", () => {
            context.setVariable("hello", "World", { readOnly: false });
            context.setVariable("hello", "World", { readOnly: false });
            expect(context.getVariable("hello")).to.equals("World");
        });

        it("should fail if a readonly variable already exists", () => {
            try {
                context.setVariable("hello", "World", { readOnly: true });
                context.setVariable("hello", "World", { readOnly: true });
            }
            catch (err) {
                expect(err).to.be.ok;
                return;
            }

            expect(false).to.be.true;
        });
    });

    describe("#getOrLoadVariable", () => {
        it("should fail if variable doesn't exists", () => {
            try {
                context.getOrLoadVariable("ne");
            }
            catch (err) {
                expect(err).to.be.ok;
                return;
            }

            expect(false).to.be.true;
        });
    });
});