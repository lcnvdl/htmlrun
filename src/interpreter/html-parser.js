class HtmlParser {
    /**
     * @param {Cheerio} $ 
     */
    constructor($) {
        if (!$) {
            throw new Error("Invalid operation");
        }
        
        this.$ = $;
    }

    limitSpaces(text) {
        return text.replace(new RegExp("\\s+"), " ");
    }

    getWords(elements) {
        let words;
        if (elements.length > 0) {
            words = elements.map(m => this.$(m).text().trim());
        }
        else {
            words = [];
        }

        return words;
    }

    /**
     * Get the words of the children elements. If there is a text instead of
     * children elements, it will separate the text using spaces.
     * @param {*} parent Parent
     * @returns {string[]}
     */
    getChildrenWords(parent) {
        let words;
        if (parent.children().toArray().length > 0) {
            words = parent.children().toArray().map(m => this.$(m).text().trim());
        }
        else {
            let text = this.limitSpaces(parent.text());
            words = text.split(" ");
        }

        return words;
    }
}

module.exports = HtmlParser;