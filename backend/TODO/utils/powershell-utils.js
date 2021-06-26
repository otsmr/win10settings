const path = require("path");
const fs = require("fs");
const { checkFolder } = require("./utilis");

const powershell = require("./powershell");

exports.checkRegPathRecursive = (regpath, callBack) => {

    const regpathSplited = regpath.split("\\");

    function checkSinglePath (i) {

        if (!regpathSplited[i-1]) return callBack();

        const path = regpathSplited.slice(0, i).join("\\");
        
        powershell.run(`if ((Test-Path '${path}') -eq $false) { New-Item '${path}'; }`, (err, result) => {
            if (err) return callBack(true, result);

            checkSinglePath(i+1);
        })

    }

    checkSinglePath(2);
    
}

exports.checkForHostsFileInMSDefender = (call) => {

    powershell.getJson("Get-MpPreference", [
        "ExclusionPath"
    ], (err, output) => {

        try {
            
            if (output.ExclusionPath.indexOf("C:\\Windows\\System32\\drivers\\etc\\hosts") > -1) {
                return call(false);
            }

        } catch (error) { }

        powershell.runAsAdmin(`Add-MpPreference -ExclusionPath 'C:\\Windows\\System32\\drivers\\etc\\hosts'`, call);

    })

}

exports.getManifestFromAppx = (app, isDarkMode = false) => {
    
    try {

        const pfad = path.join(app.InstallLocation, "AppxManifest.xml");
        const xml = fs.readFileSync(pfad).toString();
        const logoName = xml.match(new RegExp("<Logo>(.*?)</Logo>"))[1];
        const publisher = xml.match(new RegExp("<PublisherDisplayName>(.*?)</PublisherDisplayName>"))[1];

        const files = fs.readdirSync(path.dirname(path.join(app.InstallLocation, logoName)));
        const startFileWidth = path.basename(logoName).replace(path.extname(path.basename(logoName)), "");
        let icon = false;

        let iconWhite = false;
        for (const file of files) {
            if (file.startsWith(startFileWidth) && (file.endsWith(".png") || file.endsWith(".jpg"))) {
                if (file.indexOf((isDarkMode) ? "contrast-black" : "contrast-white") > -1) {
                    iconWhite = file;
                    break;
                }
                if (file.indexOf("scale") > -1) icon = file;
            }
        }
        if (iconWhite) icon = iconWhite;
        if (!icon) icon = "";

        let name = xml.match(new RegExp("<DisplayName>(.*?)</DisplayName>"))[1];

        if (name.startsWith("ms-resource:")) {
            name = app.Name.split(".").slice(1).join(" ").replace("Zune", "")
        }

        if (!fs.existsSync(path.join(app.InstallLocation, path.dirname(logoName), icon))) {
            try {
                logoName = "";
                icon = xml.match(new RegExp("<Logo>(.*?)</Logo>"))[1];
            } catch (error) {
                console.log(error);
            }
        }

        return {
            title: name,
            id: app.Name,
            desc: publisher,
            icon: path.join(app.InstallLocation, path.dirname(logoName), icon)
        }

    } catch (error) {}

    return null;

}

exports.getUserstheme = (callBack) => {

    powershell.getJson(`Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize"`, [
        "AppsUseLightTheme"
    ], (err, jsonIsDarkMode) => {

        let isDarkMode = false;
        try {
            if (jsonIsDarkMode["AppsUseLightTheme"] === 0) isDarkMode = true;
        } catch (error) {}

        callBack(isDarkMode);
    
    });

}

exports.getCurrentUsers = (callBack) => {

    powershell.getJson(`$userAccount = new-object System.Security.Principal.NTAccount($env:UserName);$userAccount.Translate([System.Security.Principal.SecurityIdentifier])`,[
        "Value"
    ], (err, json) => {
        if (err) return callBack(true, json);

        callBack(false, {
            hkcu: `Registry::HKEY_USERS\\${json["Value"]}`,
            sid: json["Value"]
        });

    })
    
}

exports.saveIconFromExe = (exe, name) => {

    let filePath = process.userData + "\\icons\\";
    checkFolder(filePath);
    
    filePath += name + ".png";

    if (fs.existsSync(filePath)) return filePath;
    
    powershell.runSync(`[System.Reflection.Assembly]::LoadWithPartialName('System.Drawing') | Out-Null;[System.Drawing.Icon]::ExtractAssociatedIcon("${exe}").ToBitmap().Save("${filePath}");`);

    return filePath;

}

exports.runningAsAdministrator = (callBack) => {

    powershell.run(`([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)`, (err, res) => {

        let isAdmin = false;
        if (res.replace("\r\n", "") !== "False") isAdmin = true;

        callBack(err, isAdmin);

    });

}


exports.Service = class {

    constructor (name) {
        this.name = name;
    }

    status (callBack) {

        powershell.getJson(`Get-Service -Name "${this.name}"`, [
            "Name",
            "DisplayName",
            "Status",
            "StartType"
        ], callBack);

    }

    disable () {
        powershell.runAsAdmin(`Stop-Service -Name '${this.name}' -Force;Set-Service -Name '${this.name}' -StartupType Disabled`);
    }

    enable (startUpType = "Manual") {
        powershell.runAsAdmin(`Set-Service -Name '${this.name}' -StartupType ${startUpType};Start-Service -Name '${this.name}' -Force;`);
    }

}