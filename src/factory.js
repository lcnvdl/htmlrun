const cheerio = require("cheerio");

const http = require("http");
const fs = require("fs");
const path = require("path");

const Constructors = {
    klass: () => new (require("./interpreter/klass"))(),
    console: () => new (require("./interpreter/program"))()
};

class Factory {
    static async createInstance(url, workingDirectory) {
        const content = await this._getContent(url, workingDirectory);
        return Factory.createInstanceFromContent(content, workingDirectory);
    }

    static createInstanceFromContent(content, workingDirectory) {
        const $ = cheerio.load(content);

        let runtime;
        let metatags = {};

        $("meta").each((i, e) => {
            if (e.attribs["name"] === "runtime") {
                let val = e.attribs["value"];
                runtime = val;
            }

            metatags[e.attribs["name"]] = e.attribs["value"];
        });

        if (!runtime) {
            runtime = "console";
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
