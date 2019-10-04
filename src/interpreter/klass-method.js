const KlassMember = require("./klass-member");

class KlassMethod extends KlassMember {
    constructor(name, visibility, description, parameters) {
        super(name, visibility, description);
        this.parameters = parameters;
    }
}

module.exports = KlassMethod;