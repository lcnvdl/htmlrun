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

        let processedArr = [];

        if (arr.length > 0) {
            if (arr[0][arr[0].length - 1] === ":") {
                processedArr.push("Set");
                processedArr.push(arr[0].trim().substr(0, arr[0].length - 1));
                processedArr.push("=");
                
                arr.slice(1).forEach(m => processedArr.push(m));
            }
            else if (arr[1] === ":") {
                processedArr.push("Set");
                processedArr.push(arr[0]);
                processedArr.push("=");
                
                arr.slice(2).forEach(m => processedArr.push(m));
            }
            else {
                processedArr = arr;
            }
        }
        else {
            processedArr = arr;
        }

        this.name = processedArr.splice(0, 1)[0];
        this.args = processedArr;
        return this;
    }

    getArgument(i) {
        return this.args[i];
    }
}

module.exports = ProgramInstruction;
