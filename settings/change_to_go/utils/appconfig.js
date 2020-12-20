
const nconf = require("nconf");
const fs = require("fs");

const log = require("./logs");
const defaultConfigs = require("../../config.json");

module.exports = new class {

    constructor () {

        this._confFile = `${process.userData}\\config.json`;

        log.info("default", `Konfigurationsdatei: ${this._confFile}`);

        if (!fs.existsSync(this._confFile)) {
            fs.writeFileSync(this._confFile, "{}");
        }

        this.load();
        
    }

    clear () {

        try {
            fs.writeFileSync(this._confFile, "{}");
            nconf.remove('file');
            nconf.remove("defaults");
            this.load();
        } catch (error) { }

    }

    load () {

        nconf.file("file", {
            file: this._confFile
        });

        nconf.defaults(defaultConfigs);

    }

    get (param) {
        return nconf.get(param);
    }

    set (param, value) {
        nconf.set(param, value);
        nconf.save();
    }

}