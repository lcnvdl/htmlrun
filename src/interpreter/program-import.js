class ProgramImport {
    constructor(url, name, alias) {
        this.name = name || "";
        this.alias = alias || "";
        this.url = url || "";
    }
}

module.exports = ProgramImport;