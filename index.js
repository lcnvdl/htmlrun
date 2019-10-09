#!/usr/bin/env node

const Factory = require("./src/factory");
const Runtime = require("./src/runtime/runtime");
const path = require("path");

if (!process.argv.slice(2).length) {
    console.log("html <file>");
    process.exit();
}

const bar = path.join("a", "b")[1];

let dir = process.cwd();
let entry = process.argv.slice(2)[0].split("/").join(bar).split("\\").join(bar);

(async () => {
    let workingDirectory;

    if (entry[0] === ".") {
        workingDirectory = path.join(dir, entry);
        workingDirectory = workingDirectory.substr(0, workingDirectory.lastIndexOf(bar));
        if (!workingDirectory || workingDirectory === "") {
            workingDirectory = ".";
        }
    }
    else {
        workingDirectory = entry.substr(0, entry.lastIndexOf(bar));
    }

    entry = entry.substr(entry.lastIndexOf(bar) + 1);

    const program = await Factory.createInstance(entry, workingDirectory);
    const runtime = new Runtime();
    const context = await runtime.createContext(program, process.argv.slice(3), { workingDirectory });
    runtime.run(context);
})().catch(err => {
    console.error(err);
});