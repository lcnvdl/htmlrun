const KlassMember = require("./klass-member");

class KlassAttribute extends KlassMember {
    constructor(name, visibility, description) {
        super(name, visibility, description);
    }
}

module.exports = KlassAttribute;