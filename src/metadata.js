class Metadata {
    constructor() {
        this.classes = [];
    }

    addClass(c) {
        this.classes.push(c);
        return this;
    }
}

module.exports = Metadata;