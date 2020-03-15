
const powershell = require("../utils/powershell");
const appconfig = require("../utils/appconfig");

const configs = {
    get: {},
    set: {}
}

const getHKCU = () => {
    return appconfig.get("HKEY_CURRENT_USER");
}


// ------------------------------------------------------------------


configs.get["taskbar:showTrayIcons"] = (callBack) => {

    powershell.getJSONAsync(`get-itemproperty '${getHKCU()}\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\'`, [
        "EnableAutoTray",
    ], (err, json) => {
        if (err) return callBack(true, json);
        callBack(err, (json.EnableAutoTray === 0) ? true : false);
    });

}
configs.set["taskbar:showTrayIcons"] = (value, callBack) => {

    const path = `${getHKCU()}\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\`;

    powershell.runAsync(`Set-ItemProperty -Path '${path}' -Name EnableAutoTray -Value ${(value) ? "0" : "1"}`, (err, json) => {
        if (err) return callBack(true, json);
        configs.get["taskbar:showTrayIcons"](callBack);
    });

}


// ------------------------------------------------------------------



configs.get["taskbar:searchboxTaskbarMode"] = (callBack) => {

    powershell.getJSONAsync(`get-itemproperty '${getHKCU()}\\Software\\Microsoft\\Windows\\CurrentVersion\\Search'`, [
        "SearchboxTaskbarMode",
    ], (err, json) => {
        if (err) return callBack(true, json);
        callBack(err, (json.SearchboxTaskbarMode === 0) ? true : false);
    });

}
configs.set["taskbar:searchboxTaskbarMode"] = (value, callBack) => {

    const path = `${getHKCU()}\\Software\\Microsoft\\Windows\\CurrentVersion\\Search`;

    powershell.runAsync(`Set-ItemProperty -Path '${path}' -Name SearchboxTaskbarMode -Value ${(value) ? "0" : "2"}`, (err, json) => {
        if (err) return callBack(true, json);
        configs.get["taskbar:searchboxTaskbarMode"](callBack);
    });

}



module.exports = configs;