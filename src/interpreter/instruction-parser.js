/** @typedef {import("cheerio")} cheerio */

const ProgramInstruction = require("./program-instruction");
const HtmlParser = require("./html-parser");

class InstructionParser extends HtmlParser {
    /** 
     * @param {cheerio} $ $
     */
    constructor($) {
        super($);
    }

    /**
     * @param {CheerioSelector} list <ol> or <ul>
     * @returns {ProgramInstruction[]}
     */
    getInstructions(list) {
        let instructions = [];

        list.children("li").each((_, e) => {
            let li = this.$(e);
            if (li.text().trim() === "" || li.hasClass("comment")) {
                return;
            }

            const instruction = this.getInstruction(li);
            instructions.push(instruction);
        });

        return instructions;
    }

    /**
     * @param {CheerioSelector} list <ol> or <ul>
     */
    getInstruction(li) {
        const subInstructionsList = this._getSubInstructionsList(li);

        const words = this._getWordsForInstructions(li);
        let instruction = new ProgramInstruction().fromArray(words);

        if (subInstructionsList && subInstructionsList.length > 0) {
            instruction.children = this._getSubInstructionsFromList(subInstructionsList);
        }

        return instruction;
    }

    /**
     * @param {CheerioSelector} list <ol> or <ul>
     */
    _getWordsForInstructions(list) {
        let words = this.getChildrenWords(list);
        list.children().toArray().forEach(m => this.$(m).remove());
        const textInTheMiddle = list.text().trim();

        if (textInTheMiddle !== "") {
            words = [words[0], textInTheMiddle, ...words.slice(1)];
        }

        return words;
    }

    /**
     * @param {CheerioSelector} list <ol> or <ul>
     */
    _getSubInstructionsList(list) {
        let subInstructionsList = list.find("ul").length > 0 ? list.find("ul") : list.find("ol");

        if (subInstructionsList && subInstructionsList.length > 0) {
            let aux = this.$(subInstructionsList.html());

            subInstructionsList.remove();
            subInstructionsList = aux;
        }
        else {
            subInstructionsList = null;
        }

        return subInstructionsList;
    }

    /**
     * @param {CheerioSelector} subInstructionsList <ol> or <ul>
     */
    _getSubInstructionsFromList(subInstructionsList) {
        /** @type {ProgramInstruction[]} */
        let subInstructions = [];

        subInstructionsList.children().toArray().forEach(element => {
            const li = this.$(element);
            const words = this._getWordsForInstructions(li);
            let subInstruction = new ProgramInstruction().fromArray(words);
            subInstructions.push(subInstruction);
        });

        return subInstructions;
    }
}

module.exports = InstructionParser;