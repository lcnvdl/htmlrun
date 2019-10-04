class ProgramImport {
    constructor(url, name, alias, aliasType) {
        this.name = name || "";
        this.alias = alias || "";
        this.url = url || "";
        this.aliasType = aliasType || null;
    }
}

module.exports = ProgramImport;