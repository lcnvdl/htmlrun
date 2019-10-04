const cheerio = require('cheerio');
const Metadata = require("./metadata");

const http = require("http");

const Constructors = {
    klass: () => new (require("./interpreter/klass"))()
};

class Factory {
    static createInstance(url) {
        return new Promise((resolve, reject) => {
            const req = http.get(url, res => {
                res.setEncoding("utf8");
                res.on("data", function (chunk) {
                    content += chunk;
                });

                res.on("end", function () {
                    resolve(Factory.createInstanceFromContent(content));
                });
            }).on('error', function (e) {
                reject(e);
            });

            req.end();
        });
    }

    static createInstanceFromContent(content) {
        const $ = cheerio.load(content);

        let runtime;

        $("metatag").each((i, e) => {
            if (e.attribs["name"] === "runtime") {
                let val = e.attribs["value"];
                runtime = val;
            }
        });

        if (!runtime) {
            runtime = "console";
        }

        if (!Constructors[runtime]) {
            throw new Error(`Invalid runtime: ${runtime}`);
        }

        let instance = Constructors[runtime]();
        instance.fill($("body"));
        return instance;
    }
}

module.exports = Factory;