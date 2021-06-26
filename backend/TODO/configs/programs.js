
const fs = require("fs");

const appconfig = require("../utils/appconfig")
const powershell = require("../utils/powershell");
const {
    getManifestFromAppx,
    getUserstheme
} = require("../utils/powershell-utils");

const configs = {
    get: {},
    set: {}
}


// ------------------------------------------------------------------


const loadWinApps = (isDarkMode, callBack) => {

    const sid = appconfig.get("CURRENT_USER_SID");
    const filderWinApps = appconfig.get("configs:programs:winapps:filderWinApps");
    const preSelectForRemove = appconfig.get("configs:programs:winapps:preSelectForRemove");
    const ignoreAppxByTitle = appconfig.get("configs:programs:winapps:ignoreAppxByTitle");


    powershell.getJson(`Get-AppxPackage -User '${sid}'`, [
        "Name",
        "PackageFullName",
        "InstallLocation"
    ], (err, apps) => {
        if (err) return callBack(err, "App-Liste konnte nicht geladen werden.");

        let appList = [];
        for (const app of apps) {

            const manifest = getManifestFromAppx(app, isDarkMode);
            
            if(!manifest) continue;

            if (filderWinApps) {
                if ( 
                    ignoreAppxByTitle.indexOf(manifest.title) > -1 ||
    
                    manifest.title === "" ||
                    manifest.title.indexOf(".Net") > -1 ||
                    manifest.title.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ||
    
                    manifest.desc === "Microsoft Platform Extensions" ||
                    manifest.desc === "Unbekannt" ||
                    manifest.desc.toLowerCase().indexOf("ms-resource:") > -1
                ) continue;
            }


            if (!appList.find(e => e.id === manifest.id)) {

                if (fs.existsSync(manifest.icon) && fs.lstatSync(manifest.icon).isFile())
                    manifest.icon = "file:///" + manifest.icon;
                else manifest.icon = null;

                appList.push({
                    ...manifest,
                    icon: manifest.icon,
                    checked: (preSelectForRemove.indexOf(manifest.id) > -1)
                });

            }

        }

        appList = appList.sort((a, b) => {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
        })

        callBack(false, appList);

    });

}

configs.get["winapps:appliste"] = (callBack) => {
    
    const isDarkMode = appconfig.get("app:theme");

    if (isDarkMode === "system") {

        getUserstheme((isDarkMode) => {
            loadWinApps(isDarkMode, callBack);
        });

    } else loadWinApps(isDarkMode === "dark", callBack);

}
configs.set["winapps:appliste"] = (listForRemove, callBack) => {

    let befehl = "";
    const sid = appconfig.get("CURRENT_USER_SID");

    listForRemove.forEach(appID => {
        befehl += `Remove-AppxPackage -Package (Get-AppxPackage -Name '${appID}' | % {$_.PackageFullName}) -User '${sid}';`
    });

    powershell.run(befehl, () => {
        configs.get["winapps:appliste"](callBack);
    })

}


// ------------------------------------------------------------------


module.exports = configs;

// 7zip, KeePass, Twinkle Tray, Launcher

//     $source = "https://download.mozilla.org/?product=firefox-latest&os=win64&lang=de"
//     $destination = "$env:tmp/firefox.exe"

//     if (Get-Command 'Invoke-Webrequest'){
//         Invoke-WebRequest $source -OutFile $destination
//     }else{
//         $WebClient = New-Object System.Net.WebClient
//         $webclient.DownloadFile($source, $destination)
//     }

//     Start-Process -FilePath $destination -ArgumentList "/S" -Wait
//     rm -Force $destination

//     $PATH = "C:\Program Files\Mozilla Firefox\distribution"

//     if (!(Test-Path $PATH)) {
//         New-Item -Path $PATH -ItemType Directory
//     }

//     New-Item -Path $PATH -Name "policies.json" -Force -Value '
//     {
//         "policies": {
//             "DisableFeedbackCommands": true,
//             "DisableFirefoxAccounts": true,
//             "DisableFirefoxStudies": true,
//             "DisableMasterPasswordCreation": true,
//             "DisablePocket": true,
//             "DisableTelemetry": true,
//             "DisplayBookmarksToolbar": true,
//             "EnableTrackingProtection": {
//                 "Cryptomining": true,
//                 "Fingerprinting": true,
//                 "Value": true
//             },
//             "FirefoxHome": {
//                 "Highlights": false,
//                 "Pocket": false,
//                 "Search": true,
//                 "Snippets": false,
//                 "TopSites": false
//             },
            // "ExtensionSettings": {
            //     "uBlock0@raymondhill.net": {
                //     "install_url": "https://addons.mozilla.org/firefox/downloads/latest/ublock-origin/latest.xpi",
                //     "installation_mode": "normal_installed"
            //     },
            //     "CanvasBlocker@kkapsner.net": {
                //     "install_url": "https://addons.mozilla.org/firefox/downloads/file/3488342/canvasblocker-1.0-an+fx.xpi",
                //     "installation_mode": "normal_installed"
            //     }
            // },
//             "NewTabPage": true,
//             "NoDefaultBookmarks": true,
//             "OfferToSaveLogins": false,
//             "OfferToSaveLoginsDefault": false,
//             "PasswordManagerEnabled": false,
//             "Preferences": {
//                 "browser.tabs.warnOnClose": false,
//                 "browser.urlbar.suggest.bookmark": true,
//                 "browser.urlbar.suggest.history": true,
//                 "browser.urlbar.suggest.openpage": true
//             },
//             "PromptForDownloadLocation": true
//         }
//     }'
// }