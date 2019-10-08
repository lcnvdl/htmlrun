class Definitions {
    constructor() {
        this.methods = [];
    }

    /**
     * @param {string} body Body
     * @param {*} metatags Metatags
     */
    fill(body, metatags) {
        this.metatags = metatags;

        const $ = cheerio.load(body);
        const parser = new HtmlParser($);
        const table = $("table");

        if (table.length === 0) {
            throw new Error("A class definition must be in an html table");
        }

        //  T Body
        let trs = table.find("tbody").find("tr");
        let section = null;

        for (let i = 0; i < trs.length; i++) {
            let tr = $(trs.get(i));
            let tds = tr.find("td").toArray();

            if (tds.length === 1) {
                let possibleSection = $(tds[0]).text().toLowerCase().trim();
                if (possibleSection !== "parameters" && possibleSection !== "definitions") {
                    throw new Error(`Invalid section in the definition file of the class ${this.name}: ${possibleSection}`);
                }

                section = possibleSection;
            }
            else if (tds.length === 2) {
                let [key, value] = parser.getWords(tds);

                if (section === "definitions") {
                    this._addMethodDefinition(key, value);
                }
                else {
                    this._addParameterDefinition(key, value);
                }
            }
            else if (tds.length > 2) {
                throw new Error("Invalid row: it must have two columns.");
            }
        }
    }

    _addMethodDefinition(key, value) {
        throw new Error("Not implemented");
    }

    _addParameterDefinition(key, value) {
        throw new Error("Not implemented");
    }
}

module.exports = Definitions;