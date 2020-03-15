
const powershell = require("../utils/powershell");
const appconfig = require("../utils/appconfig");
const {
    saveIconFromExe
} = require("../utils/powershell-utils");

const configs = {
    get: {},
    set: {}
}

const getHKCU = () => {
    return appconfig.get("HKEY_CURRENT_USER");
}


// ------------------------------------------------------------------


const EPATHS = [
    "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace",
    "HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MyComputer\\NameSpace",
    "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\FolderDescriptions",
    "HKLM:\\SOFTWARE\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Explorer\\FolderDescriptions"
]

const items = [
    { id: "threeDobject", title: "3D Objecte", checked: false, keys: {
        NameSpace: "{0DB7E03F-FC29-4DC6-9020-FF41B59E513A}"
    } },
    { id: "images", title: "Bilder", checked: false, keys: {
        NameSpace: "{24ad3ad4-a569-4530-98e1-ab02f9417aa8}",
        FolderDescriptions: "{0ddd015d-b06c-45d5-8c4c-f59713854639}",
        BaseFolderId: "{33E28130-4E1E-4676-835A-98395C3BC3BB}"
    } },
    { id: "documents", title: "Dokumente", checked: false, keys: {
        NameSpace: "{d3162b92-9365-467a-956b-92703aca08af}",
        FolderDescriptions: "{f42ee2d3-909f-4907-8871-4c22fc0bf756}",
        BaseFolderId: "{FDD39AD0-238F-46AF-ADB4-6C85480369C7}"
    } },
    { id: "music", title: "Musik", checked: false, keys: {
        NameSpace: "{3dfdf296-dbec-4fb4-81d1-6a3438bcf4de}",
        FolderDescriptions: "{a0c69a99-21c8-4671-8703-7934162fcf1d}",
        BaseFolderId: "{4BD8D571-6D19-48D3-BE97-422220080E43}"
    } },
    { id: "videos", title: "Videos", checked: false, keys: {
        NameSpace: "{f86fa3ab-70d2-4fc7-9c99-fcbf05467f3a}",
        FolderDescriptions: "{35286a68-3c57-41a1-bbb1-0eae73d76c95}",
        BaseFolderId: "{18989B1D-99B5-455B-841C-AB7C74E4DDFC}"
    } },
    { id: "desktop", title: "Desktop", checked: false, keys: {
        NameSpace: "{B4BFCC3A-DB2C-424C-B029-7FE99A87C641}"
    } },
    { id: "downloads", title: "Downloads", key: "", checked: false, keys: {
        NameSpace: "{088e3905-0323-4b02-9826-5d99428e115f}",
        FolderDescriptions: "{7d83ee9b-2244-4e70-b1f5-5393042af1e4}",
        BaseFolderId: "{374DE290-123F-4565-9164-39C4925E467B"
    } }
]

configs.get["shortcuts:thispc"] = (callBack) => {

    powershell.getJSONAsync(`Get-ChildItem -Path '${EPATHS[0]}'`, [
        "PSChildName"
    ], (err, json) => {
        if (err) return callBack(err, json);

        json = json.map(e => e.PSChildName);

        const explorerItems = items.map(e => {
            return {
                ...e,
                checked: (json.find(i => i.toUpperCase() === e.keys.NameSpace.toUpperCase())) ? true : false
            }
        })

        callBack(false, explorerItems);

    })

}
configs.set["shortcuts:thispc"] = (values, callBack) => {

    const { id, value } = values;

    const item = items.find(e => e.id === id);
    if (!item) return callBack(true, "Key nicht gefunden");

    let befehl = ""; 

    if (item.keys.NameSpace) {

        [ EPATHS[0], EPATHS[1] ].forEach(path => {
            befehl += `${(value) ? "New" : "Remove"}-Item '${path}\\${item.keys.NameSpace}';`
        })

    }

    if (item.keys.BaseFolderId) {

        [ EPATHS[2], EPATHS[3] ].forEach(path => {
            path = `${path}\\${item.keys.FolderDescriptions}\\PropertyBag`;
            befehl += `Set-ItemProperty -Path '${path}' -name ThisPCPolicy -Value ${(value) ? "Show" : "Hide"} -Force;`
        })

    }

    powershell.runAsAdmin(befehl);
    
    configs.get["shortcuts:thispc"](callBack);

}


// ------------------------------------------------------------------

let programFoldersIDs = []

configs.get["shortcuts:programFolders"] = (callBack) => {

    powershell.getJSONAsync(`
$items = (gci "${getHKCU()}\\Software\\Classes\\CLSID"  -ea SilentlyContinue | % { if((get-itemproperty -Path $_.PsPath) -match "IsPinnedToNameSpaceTree") { $_.PsPath} });
$return = @();
foreach ($path in $items) {

    $item = get-itemproperty -Path $path | Select-Object -Property 'System.IsPinnedToNameSpaceTree', '(default)';
    $icon = get-itemproperty (Get-ChildItem $path | Select-Object -Property * | where {($_.Name -like "*DefaultIcon*")} | % {$_.PsPath}) | Select-Object -Property '(default)';
    $return += [pscustomobject] @{
        title = $item | % {$_."(default)"};
        checked = $item | % {$_."System.IsPinnedToNameSpaceTree"};
        icon = $icon | % {$_."(default)"};
        path = $path;
    }

}; $return`, [
        "title",
        "checked",
        "icon",
        "path"
    ], (err, json) => {

        if (err) return callBack(err, json);

        if (json["title"]) json = [json];

        const result = []
        let count = 0;
        json.forEach(e => {

            programFoldersIDs[count] = e["path"];

            const add = {
                title: e["title"],
                icon: e["icon"],
                id: count,
                checked: (e["checked"] === 0) ? false : true
            }

            if (add.icon && add.icon.endsWith(".exe")) {
                add.icon = saveIconFromExe(add.icon, add.title);
                console.log(add.icon);
            }

            result.push(add);
            count++;
        });

        callBack(false, result);
    });

}
configs.set["shortcuts:programFolders"] = (values, callBack) => {

    console.log(values, programFoldersIDs);

    const path = programFoldersIDs[values.id];
    const value = (values.value) ? "1" : "0";

    powershell.runAsAdmin(`set-itemproperty -Path '${path}' -Name 'System.IsPinnedToNameSpaceTree' -Value ${value}`, (err, res) => {

        configs.get["shortcuts:programFolders"](callBack);

    });

}


// ------------------------------------------------------------------


configs.get["folderoptions:fileextensions"] = (callBack) => {

    powershell.getJSONAsync(`get-itemproperty '${getHKCU()}\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'`, [
        "HideFileExt",
    ], (err, json) => {
        if (err) return callBack(true, json);
        callBack(err, (json.HideFileExt === 0) ? true : false);
    });

}
configs.set["folderoptions:fileextensions"] = (value, callBack) => {

    const path = `${getHKCU()}\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced`;

    powershell.runAsync(`Set-ItemProperty -Path '${path}' -Name HideFileExt -Value ${(value) ? "0" : "1"}`, (err, json) => {
        if (err) return callBack(true, json);
        configs.get["folderoptions:fileextensions"](callBack);
    });

}


// ------------------------------------------------------------------



configs.get["folderoptions:openwith"] = (callBack) => {

    powershell.getJSONAsync(`get-itemproperty '${getHKCU()}\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced'`, [
        "LaunchTo",
    ], (err, json) => {
        if (err) return callBack(true, json);
        callBack(err, (json.LaunchTo === 1) ? true : false);
    });

}
configs.set["folderoptions:openwith"] = (value, callBack) => {

    const path = `${getHKCU()}\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced`;

    powershell.runAsync(`Set-ItemProperty -Path '${path}' -Name LaunchTo -Value ${(value) ? "1" : "2"}`, (err, json) => {
        if (err) return callBack(true, json);
        configs.get["folderoptions:openwith"](callBack);
    });

}



module.exports = configs;