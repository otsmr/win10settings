
const { app, shell } = require("electron");
const isDev = require("electron-is-dev");

const socket = require("./utils/socket");
const appconfig = require("./utils/appconfig");
const powershell = require("./utils/powershell");

const configs = {
    privacy: require("./configs/privacy"),
    programs: require("./configs/programs"),
    app: require("./configs/app"),
    explorer: require("./configs/explorer"),
    tools: require("./configs/tools"),
    personalization: require("./configs/personalization"),
    ssd: require("./configs/ssd")
}

const getConfig = (configID, type) => {

    const splited = configID.split(":");

    if (splited.length < 3 || !configs[splited[0]]) return null;

    const relativeID = splited.slice(1, splited.length).join(":");
    const config = configs[splited[0]];

    return (config[type][relativeID]) ? config[type][relativeID] : null;

}

module.exports = (window) => {


    socket

    .on("restartWinExplorer", () => {
        powershell.runAsync("taskkill /IM explorer.exe /f; explorer.exe;", () => {});
    })
    .on("openMSConfig", () => {
        powershell.runSync("msconfig");
    })
    .on("openUrl", shell.openExternal)
    .on("openLogFolder", ()=>{
        shell.openItem(process.userData + "/logs")
    })

    .on("loadThemeMode", (callBack) => {
        callBack(appconfig.get("app:themeMode"))
    })

    .on("restartAsAdmin", () => {
        
        let path = "";
        if (!isDev)  path = `'${__dirname}/../../'`
        
        powershell.runAsAdmin(`${app.getPath("exe")} ${path} ${process.argv.slice(2).concat([
            // '--relaunchAsAdmin',
            `--userData '${process.userData}'`
        ]).join(" ")}`); 

        app.exit(0);

    }) 
    
    .on("getConfig", (configID, callBack) => {

        const config = getConfig(configID, "get");
        if (!config) return callBack(true, "Einstellung nicht gefunden")
        
        config(callBack);

    })

    .on("setConfig", (configID, value, callBack) => {

        const config = getConfig(configID, "set");
        if (!config) return callBack(true, "Einstellung nicht gefunden");

        config(value, callBack);

    })

    .on("window", (action, callBack) => {

        switch (action) {
            case "close": app.quit(); break;
            case "minimize": window.minimize(); break;
            case "toggleMaximize": 
                if (window.isMaximized()) window.restore();
                else window.maximize();
                callBack(window.isMaximized());
            break;
        }

    })

}