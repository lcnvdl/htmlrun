class HtmlParser {
    /**
     * @param {Cheerio} $ 
     */
    constructor($) {
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