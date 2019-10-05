class KlassMember {
    constructor(name, visibility, description) {
        this.name = name || "";
        this.description = description || "";
        this.visibility = visibility || "+";
    }
}

module.exports = KlassMember;