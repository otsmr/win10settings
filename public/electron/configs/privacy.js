const { app } = require("electron");
const fs = require("fs");

const powershell = require("../utils/powershell");
const { Service } = require("../utils/powershell-utils");
const appconfig = require("../utils/appconfig");

const HOSTS_PATH = "C:\\Windows\\System32\\drivers\\etc\\hosts";
const configs = {
    get: {},
    set: {}
}

const getHKCU = () => {
    return appconfig.get("HKEY_CURRENT_USER");
}


// ------------------------------------------------------------------


configs.get["telemetrie:allowtelemetry"] = (callBack) => {

    powershell.getJSONAsync(`get-itemproperty HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection`, [
        "AllowTelemetry"
    ], (err, json) => {
        if (err) return callBack(err, json);
        
        callBack(false, json["AllowTelemetry"] == "0");
    
    });

}
configs.set["telemetrie:allowtelemetry"] = (value, callBack) => {

    const newValue = (value) ? "0" : "1";

    powershell.runAsAdmin(`set-itemproperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection' -Name AllowTelemetry -Value '${newValue}' -Force`);

    configs.get["telemetrie:allowtelemetry"](callBack);

}


// ------------------------------------------------------------------


configs.get["telemetrie:requestFeedback"] = (callBack) => {

    powershell.getJSONAsync(`get-itemproperty -Path ${getHKCU()}\\Software\\Microsoft\\Siuf\\Rules`, [
        "NumberOfSIUFInPeriod",
        "PeriodInNanoSeconds",
    ], (err, json) => {
        if (err) return callBack(err, json);

        callBack(false, (
            json["NumberOfSIUFInPeriod"] === 0 &&
            json["PeriodInNanoSeconds"] === 0
        ));
    
    });

}
configs.set["telemetrie:requestFeedback"] = (value, callBack) => {

    
    if (value) {
        powershell.runSync(`
Set-ItemProperty -Path '${getHKCU()}\\Software\\Microsoft\\Siuf\\Rules' -Name NumberOfSIUFInPeriod -Value '0' -Force -Type DWord;
Set-ItemProperty -Path '${getHKCU()}\\Software\\Microsoft\\Siuf\\Rules' -Name PeriodInNanoSeconds -Value '0' -Force -Type DWord`
        );
    } else {
        powershell.runSync(`
Remove-itemproperty -Path '${getHKCU()}\\Software\\Microsoft\\Siuf\\Rules' -Name NumberOfSIUFInPeriod -Force;
Remove-itemproperty -Path '${getHKCU()}\\Software\\Microsoft\\Siuf\\Rules' -Name PeriodInNanoSeconds -Force
        `);
    }

    configs.get["telemetrie:requestFeedback"](callBack);

}


// ------------------------------------------------------------------

configs.get["telemetrie:blockDomainsWithHosts"] = (callBack) => {

    fs.readFile(HOSTS_PATH, (err, buffer) => {
        const file = buffer.toString();
        callBack(false, (
            file.indexOf("# Microsoft Telemetriedomain") > -1 && 
            file.indexOf("# End of Microsoft Telemetriedomain") > -1
        ));
    });
    
}
configs.set["telemetrie:blockDomainsWithHosts"] = (value, callBack) => {

    fs.readFile(HOSTS_PATH, (err, buffer) => {
        if (err) return callBack(true);
        const file = buffer.toString();

        let newValue = file;
        
        if (!value) {

            if (
                file.indexOf("# Microsoft Telemetriedomain") > -1 && 
                file.indexOf("# End of Microsoft Telemetriedomain") > -1
            ) {
                newValue = newValue.replace(/# Microsoft Telemetriedomain([\S\s]*?)# End of Microsoft Telemetriedomain/g, "");
            } else return callBack(false, true);
            
            
        } else {

            newValue += `
# Microsoft Telemetriedomain

0.0.0.0 geo.settings-win.data.microsoft.com.akadns.net
0.0.0.0 db5-eap.settings-win.data.microsoft.com.akadns.net
0.0.0.0 settings-win.data.microsoft.com
0.0.0.0 db5.settings-win.data.microsoft.com.akadns.net
0.0.0.0 asimov-win.settings.data.microsoft.com.akadns.net
0.0.0.0 vortex.data.microsoft.com
0.0.0.0 db5.vortex.data.microsoft.com.akadns.net
0.0.0.0 v10c.vortex-win.data.microsoft.com
0.0.0.0 v20.vortex-win.data.microsoft.com
0.0.0.0 v10.events.data.microsoft.com
0.0.0.0 v10-win.vortex.data.microsoft.com.akadns.net
0.0.0.0 geo.vortex.data.microsoft.com.akadns.net
0.0.0.0 v10.vortex-win.data.microsoft.com
0.0.0.0 us.vortex-win.data.microsoft.com
0.0.0.0 de.vortex-win.data.microsoft.com
0.0.0.0 eu.vortex-win.data.microsoft.com
0.0.0.0 vortex-win-sandbox.data.microsoft.com
0.0.0.0 alpha.telemetry.microsoft.com
0.0.0.0 oca.telemetry.microsoft.com
0.0.0.0 tsfe.trafficshaping.dsp.mp.microsoft.com
0.0.0.0 watson.telemetry.microsoft.com
0.0.0.0 ceuswatcab01.blob.core.windows.net
0.0.0.0 ceuswatcab02.blob.core.windows.net
0.0.0.0 ceuswatcab02.blob.core.windows.net
0.0.0.0 eaus2watcab01.blob.core.windows.net
0.0.0.0 eaus2watcab02.blob.core.windows.net
0.0.0.0 weus2watcab01.blob.core.windows.net
0.0.0.0 weus2watcab02.blob.core.windows.net

# End of Microsoft Telemetriedomain`;

        }

        const tmpPath = app.getPath("temp") + "\\" + parseInt(String(Math.random()).replace(".", "")) + ".hosts.txt";

        fs.writeFile(tmpPath, newValue, () => {

            powershell.runAsAdmin(`Copy-Item -Path '${tmpPath}' -Destination '${HOSTS_PATH}' -Force`);
    
            setTimeout(() => { // BugFix: Ergebniss hat manchmal nicht gestimmt
                fs.unlinkSync(tmpPath);
                return configs.get["telemetrie:blockDomainsWithHosts"](callBack);
            }, 500);

        });

    });


}



// ------------------------------------------------------------------



configs.get["telemetrie:basicPrivacySettings"] = (callBack) => {

    /*
        1, 2: WerbeID
        3: Zugriff auf die eigene Sprachliste
        4: Windows erlauben, das Starten von Apps nachzuverfolgen, um Start und Suchergebnisse zu verbessern        
    */
    
    powershell.getJSONAsync(`get-itemproperty -LiteralPath @(
    'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo',
    'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\AdvertisingInfo',
    '${getHKCU()}\\Control Panel\\International\\User Profile',
    '${getHKCU()}\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'
) -ErrorAction SilentlyContinue`, [
        "Enabled",
        "DisabledByGroupPolicy",
        "HttpAcceptLanguageOptOut",
        "Start_TrackProgs",
    ], (err, json) => {
        if (err) return callBack(err, json);

        const result = {}

        // Durch den LiteralPath sind die Ergebnise nicht in einem Object
        json.forEach(items => {
            for (const name in items) {
                if (items[name] !== null) result[name] = items[name]
            }
        });

        callBack(false, (
            result["Enabled"] === 0 &&
            result["DisabledByGroupPolicy"] === 1 &&
            result["HttpAcceptLanguageOptOut"] === 1 &&
            result["Start_TrackProgs"] === 0
        ));
    
    });


}
configs.set["telemetrie:basicPrivacySettings"] = (value, callBack) => {


    if (value) {

        powershell.runAsAdmin(`
set-itemproperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo' -Name Enabled -Value '0' -Type 'DWord' -Force;
New-Item -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows' -Name AdvertisingInfo  -ErrorAction SilentlyContinue;
set-itemproperty -Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\AdvertisingInfo' -Name DisabledByGroupPolicy -Value '1'  -Type 'DWord' -Force;
set-itemproperty -Path '${getHKCU()}\\Control Panel\\International\\User Profile' -Name HttpAcceptLanguageOptOut -Value '1' -Type 'DWord' -Force;
set-itemproperty -Path '${getHKCU()}\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced' -Name Start_TrackProgs -Value '0' -Type 'DWord' -Force;
        `);
    
        configs.get["telemetrie:basicPrivacySettings"](callBack);

    } else {

        callBack(true, "Diese Einstellungen müssen manuell zurückgesetzt werden.");

    }

}



// ------------------------------------------------------------------



const services = [ "diagtrack", "dmwappushservice", "retaildemo"];

for (const service of services) {

    const getServiceConfig = (serviceName) => {

        return (callBack) => {
            new Service(serviceName).status((err, status) => {
                if (err) return callBack(err, status);
                callBack(false, status.StartType === 4)
            });
        }

    }

    const setServiceConfig = (serviceName) => {
        
        return (value, callBack) => {

            const service = new Service(serviceName);

            if (value) service.disable();
            else service.enable();

            configs.get[`services:${serviceName}`](callBack);

        }
    }

    configs.get[`services:${service}`] = getServiceConfig(service);
    configs.set[`services:${service}`] = setServiceConfig(service);

}



// ------------------------------------------------------------------



configs.get["defender:mapsreporting"] = (callBack) => {

    powershell.getJSONAsync("Get-MpPreference", ["MAPSReporting"], (err, res) => {
        if (err) return callBack(err, res);

        callBack(false, res.MAPSReporting === 0);

    });

}
configs.set["defender:mapsreporting"] = (value, callBack) => {

    const newValue = (value) ? 0 : 1;

    powershell.runAsAdmin(`Set-MpPreference -MAPSReporting ${newValue}`);

    configs.get["defender:mapsreporting"](callBack);

}



// ------------------------------------------------------------------



configs.get["defender:submitsamplesconsent"] = (callBack) => {

    powershell.getJSONAsync("Get-MpPreference", ["SubmitSamplesConsent"], (err, res) => {
        if (err) return callBack(err, res);

        callBack(false, res.SubmitSamplesConsent === 0);

    });

}
configs.set["defender:submitsamplesconsent"] = (value, callBack) => {

    const newValue = (value) ? 0 : 1;

    powershell.runAsAdmin(`Set-MpPreference -SubmitSamplesConsent ${newValue}`);

    configs.get["defender:submitsamplesconsent"](callBack);

}



// ------------------------------------------------------------------




configs.get["cortana:websearch"] = (callBack) => {

    const CORTANA_PATH = `${getHKCU()}\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Search`

    powershell.getJSONAsync(`get-itemproperty ${CORTANA_PATH}`, [
        "BingSearchEnabled",
        "AllowSearchToUseLocation",
        "CortanaConsent"
    ], (err, json) => {
        if (err) return callBack(err, json);

        if (json["BingSearchEnabled"] === 0 && json["AllowSearchToUseLocation"] === 0 && json["CortanaConsent"] === 0) {
            return callBack(false, true);
        }

        callBack(false, false);

    });

}
configs.set["cortana:websearch"] = (value, callBack) => { 

    const CORTANA_PATH = `${getHKCU()}\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Search`

    value = (value) ? "0" : "1";

    powershell.runSync(`
        set-itemproperty -Path '${CORTANA_PATH}' -Name BingSearchEnabled -Value '${value}' -Type 'DWord' -Force;
        set-itemproperty -Path '${CORTANA_PATH}' -Name AllowSearchToUseLocation -Value '${value}' -Type 'DWord' -Force;
        set-itemproperty -Path '${CORTANA_PATH}' -Name CortanaConsent -Value '${value}' -Type 'DWord' -Force;
    `);

    configs.get["cortana:websearch"](callBack);

}


// ------------------------------------------------------------------



configs.get["cortana:blockDomainsWithHosts"] = (callBack) => {
    
    fs.readFile(HOSTS_PATH, (err, buffer) => {
        const file = buffer.toString();
        
        callBack(false, (
            file.indexOf("# Bing deaktiviert") > -1 && 
            file.indexOf("# End of Bing deaktiviert") > -1
        ));
    });
    
}
configs.set["cortana:blockDomainsWithHosts"] = (value, callBack) => {
    
    fs.readFile(HOSTS_PATH, (err, buffer) => {
        if (err) return callBack(true);
        const file = buffer.toString();
        
        let newValue = file;
        
        if (!value) {
            
            if (
            file.indexOf("# Bing deaktiviert") > -1 && 
            file.indexOf("# End of Bing deaktiviert") > -1
            ) {
                newValue = newValue.replace(/# Bing deaktiviert([\S\s]*?)# End of Bing deaktiviert/g, "");
            } else return callBack(false, true);
                
        
        } else {
            
            newValue += `
# Bing deaktiviert

0.0.0.0 bing.com
0.0.0.0 www.bing.com

# End of Bing deaktiviert`;
                
        }
        
        const tmpPath = app.getPath("temp") + "\\" + parseInt(String(Math.random()).replace(".", "")) + ".hosts.txt";
        
        fs.writeFile(tmpPath, newValue, () => {
            
            powershell.runAsAdmin(`
            Copy-Item -Path '${tmpPath}' -Destination '${HOSTS_PATH}' -Force
            `);
            
            setTimeout(() => { // BugFix: Ergebniss hat manchmal nicht gestimmt
                fs.unlinkSync(tmpPath);
                return configs.get["cortana:blockDomainsWithHosts"](callBack);
            }, 500);
            
        });
        
        
    });
    
    
}
    
    
    
// ------------------------------------------------------------------




const disableAdsKeys = [
    {
        path: `${getHKCU()}\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager`,
        items: {
            "FeatureManagementEnabled": 0,
            "OemPreInstalledAppsEnabled": 0,
            "RotatingLockScreenEnabled": 0,
            "RotatingLockScreenOverlayEnabled": 0,
            "SilentInstalledAppsEnabled": 0,
            "SoftLandingEnabled": 0,
            "SubscribedContentEnabled": 1,
            "SystemPaneSuggestionsEnabled": 0,
            "SubscribedContent-338388Enabled": 0,
            "PreInstalledAppsEnabled": 0,
            "RotatingLockScreenOverlayVisible": 0,
            "ContentDeliveryAllowed": 1
        }
    },
    {
        path: `${getHKCU()}\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced`,
        items: { "ShowSyncProviderNotifications": 0 }
    },
    {
        path: `${getHKCU()}\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo`,
        items: { "Enabled": 0 }
    },
    {
        path: `${getHKCU()}\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Privacy`,
        items: { "TailoredExperiencesWithDiagnosticDataEnabled": 0 }
    }
]

configs.get["ads:displayAds"] = (callBack) => {

    const check = (count) => {

        if (count >= disableAdsKeys.length) {
            return callBack(false, true);
        }

        const item = disableAdsKeys[count];

        powershell.getJSONAsync(`Get-ItemProperty -Path ${item.path}`, Object.keys(item.items), (err, json) => {
            if (err) return callBack(true, json);

            for (const key in item.items) {
                if (typeof json[key] === "undefined" || json[key] !== item.items[key]) {
                    return callBack(false, false);
                }
            }

            check(count+1);
        })

    }

    check(0);

}


configs.set["ads:displayAds"] = (value, callBack) => {

    if (!value) {
        return callBack(true, "Diese Einstellung kann nicht automatisch zurückgesetzt werden.");
    }

    let befehl = "";

    for (const item of disableAdsKeys) {

        befehl += `
if ((Test-Path '${item.path}') -eq $false) {
    New-Item '${item.path}';
}`

        for (const key in item.items) {

            befehl += `
if (Test-Path '${item.path}') {
    New-ItemProperty -Path '${item.path}' -Name '${key}' -Value ${item.items[key]} -Type DWord -Force;
} else {
    Set-ItemProperty -Path '${item.path}' -Name ${key} -Value ${item.items[key]} -Type DWord -Force;
}`

        }

    }

    befehl = befehl.replace(/\n/g, " ");

    powershell.runAsync(befehl, (err, result) => {
        if (err) return callBack(true, result);

        configs.get["ads:displayAds"](callBack);

    })

}

// ------------------------------------------------------------------



module.exports = configs;