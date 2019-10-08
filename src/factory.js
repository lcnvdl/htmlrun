const cheerio = require("cheerio");

const http = require("http");
const fs = require("fs");
const path = require("path");

const Constructors = {
    class: () => new (require("./interpreter/klass"))(),
    console: () => new (require("./interpreter/program"))(),
    definitions: () => new (require("./interpreter/definitions"))()
};

class Factory {
    static async createInstance(url, workingDirectory) {
        const content = await this._getContent(url, workingDirectory);
        const result = Factory.createInstanceFromContent(content, workingDirectory);

        if (result.metatags && result.metatags.runtime === "class") {
            const definitionsUrl = url.substr(0, url.lastIndexOf(".html")) + ".def.html";
            const definitionsContent = await this.createInstance(definitionsUrl, workingDirectory);

            if (definitionsContent) {
                result.applyDefinitions(definitionsContent);
            }
        }

        return result;
    }

    static createInstanceFromContent(content, workingDirectory, complement) {
        const $ = cheerio.load(content);

        let runtime;
        let metatags = {};

        $("meta").each((i, e) => {
            const meta = $(e);
            const name = meta.attr("name");
            if (name) {
                const val = meta.attr("value");
                if (name === "runtime") {
                    runtime = val;
                }
                else {
                    metatags[name] = val;
                }
            }
        });

        if (!runtime) {
            throw new Error("Runtime type is not specified in this file.");
        }

        if (!Constructors[runtime]) {
            throw new Error(`Invalid runtime: ${runtime}`);
        }

        let instance = Constructors[runtime]();
        instance.fill($("body").html(), metatags, { workingDirectory });
        return instance;
    }

    static _getContent(url, workingDirectory) {
        return new Promise((resolve, reject) => {

            if (url[0] === ".") {
                try {
                    let file = url;
                    if (workingDirectory) {
                        file = path.join(workingDirectory, file);
                    }

                    resolve(fs.readFileSync(file, "utf8"));
                }
                catch (err) {
                    reject(err);
                }
            }
            else {
                let content = "";
                const req = http.get(url, res => {
                    res.setEncoding("utf8");
                    res.on("data", function (chunk) {
                        content += chunk;
                    });

                    res.on("end", function () {
                        resolve(content);
                    });
                }).on("error", function (e) {
                    reject(e);
                });

                req.end();
            }
        });
    }
}

module.exports = Factory;
