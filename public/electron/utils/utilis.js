const fs = require("fs");
const { app } = require("electron");
const fetch = require('node-fetch');
// const notifier = require('node-notifier');


const checkFolder = exports.checkFolder = (dir) => {
    try {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    } catch (error) {
    }
}

exports.setUserDataFolder = () => {

    process.userData = app.getPath("userData");

    checkFolder(process.userData);
    process.userData += "\\userData";

    checkFolder(process.userData);

    process.argv.forEach((item, i) => {
        if (item === "--userData") process.userData = process.argv[i + 1];
    });

}

exports.checkForUpdates = () => {

    const appconfig = require("./appconfig");

    if (!appconfig.get("update:automaticallyCheckForUpdates")) return;

    fetch("https://api.github.com/repos/otsmr/win10settings/releases")
    .then(res => res.json())
    .then((json) => {

        if (!json[0]) return;

        const newVersion = json[0].tag_name;

        if ("v" + app.getVersion() < newVersion) {

            //TODO: write own notification system

            // notifier.notify({
            //     title: "Update verfügbar",
            //     message: `Ein Update für Erweiterte Windows Einstellungen auf Version ${newVersion} ist verfügbar!`,
            //     icon: __dirname + "/../../img/logo.png"
            // })

        }
        
    });

}