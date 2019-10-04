class HtmlParser {
    /**
     * @param {Cheerio} $ 
     */
    constructor($) {
        this.$ = $;
    }

    getChildrenWords(parent) {
        let words;
        if (parent.children().toArray().length > 0) {
            words = parent.children().toArray().map(m => this.$(m).text().trim());
        }
        else {
            let text = parent.text().replace(new RegExp("\\s+"), " ");
            words = text.split(" ");
        }

        return words;
    }
}

module.exports = HtmlParser;