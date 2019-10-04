class KlassMember {
    constructor(name, visibility, description) {
        this.name = name || "";
        this.description = description || "";
        this.visibility = visibility || "+";
    }

    get hasDefinitions() {
        return Object.keys(this.definitions).length > 0;
    }
}

module.exports = KlassMember;