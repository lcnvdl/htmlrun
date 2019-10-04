const Klass = require("../src/interpreter/klass");
const { expect } = require("chai");

let klass;

describe("Klass", () => {
    beforeEach(() => {
        klass = new Klass();
    });

    describe("#fill", () => {
        it("should fail if body doesn't have a table", () => {
            let error = null;
            try {
                klass.fill("<h1>Class</h1>");
            }
            catch (err) {
                error = err;
            }

            expect(error).to.be.ok;
        });

        it("should fail if the table doesn't have a name", () => {
            let error = null;
            try {
                klass.fill("<h1>Class</h1>\n<table><thead><tr><th></th></tr></thead><tbody></tbody></table>");
            }
            catch (err) {
                error = err;
            }

            expect(error).to.be.ok;
        });

        it("should assign a class name", () => {
            klass.fill("<h1>Class</h1>\n<table><thead><tr><th>User</th><th><b>extends </b><i>Native</i></th></tr></thead><tbody></tbody></table>");
            expect(klass.name).to.equal("User");
        });

        it("should assign a class parent with just text", () => {
            klass.fill("<h1>Class</h1>\n<table><thead><tr><th>User</th><th>extends Native</th></tr></thead><tbody></tbody></table>");
            expect(klass.parent).to.equal("Native");
        });

        it("should assign a class parent with just text and extra spaces", () => {
            klass.fill("<h1>Class</h1>\n<table><thead><tr><th>User</th><th>extends    Native</th></tr></thead><tbody></tbody></table>");
            expect(klass.parent).to.equal("Native");
        });

        it("should assign a class parent", () => {
            klass.fill("<h1>Class</h1>\n<table><thead><tr><th>User</th><th><b>extends</b> <i>Native</i></th></tr></thead><tbody></tbody></table>");
            expect(klass.parent).to.equal("Native");
        });

        it("should assign a class parent ignoring extra spaces", () => {
            klass.fill("<h1>Class</h1>\n<table><thead><tr><th>User</th><th><b>extends</b>    <i>Native</i></th></tr></thead><tbody></tbody></table>");
            expect(klass.parent).to.equal("Native");
        });

        it("should assign a class method", () => {
            klass.fill("<h1>Class</h1>\n<table><thead><tr><th>User</th><th></th></tr></thead><tbody><tr><td colspan='2'>Methods</td></tr><tr><td>+ Log(text)</td><td>Test method</td></tr></tbody></table>");
            expect(klass.methods.length).to.equal(1);
            expect(klass.methods[0].name).to.equal("Log");
            expect(klass.methods[0].description).to.equal("Test method");
            expect(klass.methods[0].parameters.length).to.equal(1);
            expect(klass.methods[0].parameters[0].name).to.equal("text");
        });

        it("add method should fail if visibility doesn't exists", () => {
            let error = null;
            try {
                klass.fill("<h1>Class</h1>\n<table><thead><tr><th>User</th><th></th></tr></thead><tbody><tr><td colspan='2'>Methods</td></tr><tr><td>Log(text)</td><td>Test method</td></tr></tbody></table>");
            }
            catch (err) {
                error = err;
            }

            expect(error).to.be.ok;
        });

        it("add method should fail if the name already exists", () => {
            let error = null;
            try {
                klass.fill("<h1>Class</h1>\n<table><thead><tr><th>User</th><th></th></tr></thead><tbody><tr><td colspan='2'>Methods</td></tr><tr><td>+ Log(text)</td><td>Test method</td></tr><tr><td>Log(text)</td><td>Test method</td></tr></tbody></table>");
            }
            catch (err) {
                error = err;
            }

            expect(error).to.be.ok;
        });
    });
});