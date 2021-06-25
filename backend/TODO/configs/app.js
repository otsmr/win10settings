
const { app } = require("electron");

const socket = require("../utils/socket");
const appconfig = require("../utils/appconfig");

const configs = {
    get: {},
    set: {}
}


// ------------------------------------------------------------------


configs.get["electron:isAdmin"] = (callBack) => {
    callBack(false, process.isAdmin);
}


// ------------------------------------------------------------------


configs.get["update:getVersion"] = (callBack) => {
    callBack(false, "v" + app.getVersion());
}


// ------------------------------------------------------------------


configs.get["gereral:themeMode"] = (callBack) => {
    callBack(false, appconfig.get("app:themeMode"));
}
configs.set["gereral:themeMode"] = (value, callBack) => {
    appconfig.set("app:themeMode", value);
    socket.emit("setThemeMode", value);
    configs.get["gereral:themeMode"](callBack);
}

// ------------------------------------------------------------------


configs.get["gereral:language"] = (callBack) => {
    callBack(false, appconfig.get("app:language"));
}
configs.set["gereral:language"] = (value, callBack) => {
    appconfig.set("app:language", value);
    socket.emit("changeLanguage", false, value);
    configs.get["gereral:language"](callBack);
}


// ------------------------------------------------------------------


const configIDs = [
    "update:automaticallyCheckForUpdates",
    "configs:programs:winapps:filderWinApps"
];
const addConfig = (configID) => {
    configs.get[configID] = (callBack) => {
        callBack(false, appconfig.get(configID));
    }
    configs.set[configID] = (value, callBack) => {
    
        appconfig.set(configID, value);
        configs.get[configID](callBack);
    
    }
}

configIDs.forEach(addConfig);


// ------------------------------------------------------------------


module.exports = configs;