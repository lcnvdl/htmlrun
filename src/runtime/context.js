class Context {
    constructor(program, args) {
        this.modules = [];
        this.program = program;
        this.arguments = args;
    } 

    addModule(m) {
        this.modules.push(m);
        return this;
    }
}

module.exports = Context;