class ContextVariable {
    /**
     * @param {*} value Value
     * @param {Object} [settings] Settings
     * @param {boolean} [settings.readOnly] Read Only
     */
    constructor(value, settings) {
        settings = settings || {};

        const { readOnly = false } = settings;

        this.value = value;
        this.readOnly = readOnly;
    }
}

module.exports = ContextVariable;