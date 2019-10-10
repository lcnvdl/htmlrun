class ProgramInstruction {
    constructor() {
        /** @type {string} */
        this.name = "moc";

        /** @type {string[]} */
        this.args = [];

        /** @type {ProgramInstruction[]} */
        this.children = [];
    }

    /**
     * @param {[]} arr Array
     */
    fromArray(arr) {
        this.name = arr.splice(0, 1)[0];
        this.args = arr;
        return this;
    }

    getArgument(i) {
        return this.args[i];
    } 
}

module.exports = ProgramInstruction;
