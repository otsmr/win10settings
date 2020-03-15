
const powershell = require("../utils/powershell");

const configs = {
    get: {},
    set: {}
}


// ------------------------------------------------------------------


configs.get["energysaver:getSSDInfos"] = (callBack) => {

    powershell.getJSONAsync(`Get-PhysicalDisk -UniqueID (Get-Disk | Where-Object {$_.IsBoot -eq $true} | % {$_.UniqueId})`,[
        "UniqueId",
        "FriendlyName",
        "MediaType"
    ], (err, json) => {
        if (err) return callBack(err, json);

        callBack(false, json);
        
    });
    
}


// ------------------------------------------------------------------


configs.get["energysaver:hibernate"] = (callBack) => {

    powershell.getJSONAsync(`Get-ItemProperty -Path HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Power`, [
        "HibernateEnabled"
    ], (err, json) => {
        if (err) return callBack(err, json);
        
        callBack(false, (json["HibernateEnabled"]) ? false : true);
    })

}
configs.set["energysaver:hibernate"] = (value, callBack) => {

    powershell.runAsAdmin(`powercfg -h ${(value) ? "off" : "on"}`);
    configs.get["energysaver:hibernate"](callBack);

}


// ------------------------------------------------------------------


configs.get["energysaver:restingState"] = (callBack) => {

    powershell.runAsync(`powercfg /list`, (err, res) => {
        if (err) return callBack(err, res);

        res = res.split("\r\n");

        for (const setting of res) {
            if (setting.indexOf("8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c") > -1 && setting.indexOf("*")) {
                return callBack(false, true);
            }
        }

        callBack(false, false);

    })

}
configs.set["energysaver:restingState"] = (value, callBack) => {

    if (value) {

        return powershell.runAsync(`powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c`, (err, res) => {
            if (err) return callBack(err, res);
            configs.get["energysaver:restingState"](callBack);
        })

    }

    powershell.runAsync(`Show-ControlPanelItem -CanonicalName Microsoft.PowerOptions`, ()=>{})
    callBack(true, "Einstellung muss manuell zurückgesetzt werden");
}


// ------------------------------------------------------------------


const prefertcherPath = "'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\\PrefetchParameters'";

configs.get["energysaver:prefetcher"] = (callBack) => {

    powershell.getJSONAsync(`Get-ItemProperty ${prefertcherPath}`, [
        "EnablePrefetcher",
        "EnableSuperfetch"
    ], (err, json) => {
        if (err) return callBack(true, json);

        callBack(false, (
            typeof json["EnablePrefetcher"] !== "undefined" &&
            json["EnablePrefetcher"] === 0 &&
            typeof json["EnableSuperfetch"] !== "undefined" &&
            json["EnableSuperfetch"] === 0            
        ));

    })

}
configs.set["energysaver:prefetcher"] = (value, callBack) => {

    value = (value) ? "0" : "1"

    powershell.runAsAdmin(
`Set-ItemProperty ${prefertcherPath} -Name EnablePrefetcher -Value ${value} -Force;
Set-ItemProperty ${prefertcherPath} -Name EnableSuperfetch -Value ${value} -Force;`)

    configs.get["energysaver:prefetcher"](callBack);

}


// ------------------------------------------------------------------


configs.get["energysaver:trim"] = (callBack) => {

    powershell.runAsync(`fsutil behavior query DisableDeleteNotify`, (err, res) => {
        if (err) return callBack(err, res);

        res = res.split("\r\n");
        callBack(false, res[0].indexOf("DisableDeleteNotify = 0") > -1);

    })

}
configs.set["energysaver:trim"] = (value, callBack) => {

    powershell.runAsAdmin(`fsutil behavior set DisableDeleteNotify ${(value) ? "0" : "1"}`);

    configs.get["energysaver:trim"](callBack);

}


module.exports = configs;