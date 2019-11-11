const Factory = require("../src/factory");
const { expect } = require("chai");

describe("Factory", () => {
    describe("#createInstanceFromContent", () => {
        it("should fail if doesn't have a runtime metatag", () => {
            try {
                Factory.createInstanceFromContent("<html></html>", __dirname);
            } catch (err) {
                expect(err).to.be.ok;
                return;
            }

            expect(false).to.be.true;
        });
    });
});