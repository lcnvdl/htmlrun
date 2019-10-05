const KlassMember = require("./klass-member");

class KlassMethod extends KlassMember {
    constructor(name, visibility, description, parameters) {
        super(name, visibility, description);
        this.parameters = parameters;
        this.definitions = {};
    }

    get hasDefinitions() {
        return Object.keys(this.definitions).length > 0;
    }
}

module.exports = KlassMethod;