
const appconfig = require("../utils/appconfig");
const powershell = require("../utils/powershell");
const fs = require("fs");
const { app } = require("electron");
const configs = {
    get: {},
    set: {}
}

const appdata = app.getPath("appData");
const appDataPath = appdata + "/win10settings.tools";
if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath);
}

const getHKCU = () => {
    return appconfig.get("HKEY_CURRENT_USER");
}
const getEscapedPath = () => {
    let hkcu = getHKCU();    
    return { 
        escaped: `${hkcu}\\Software\\Classes\\\`*\\shell`,
        normal: `${hkcu}\\Software\\Classes\\*\\shell`
    };
}


// ------------------------------------------------------------------


configs.get["filehasher:enabled"] = (callBack) => {
    
    powershell.runAsync(`Test-Path '${getHKCU()}\\Software\\Classes\\\`*\\shell\\DateiHash'`, (err, res) => {

        callBack(false, (res.replace("\r\n", "") === "True") ? true : false);
    
    })
    
}
configs.set["filehasher:enabled"] = (value, callBack) => {

    let { escaped, normal } = getEscapedPath();
    escaped +=  "\\DateiHash";
    normal +=  "\\DateiHash";

    if (value) {

fs.writeFileSync(appDataPath + "/filehasher.bat", `
@echo off
color 06
mode con: cols=80 lines=9
set File=%1
set Algorithm=%2

for /r %%f in (%File%) do (
    set FileName=%%~nxf
)

title %Algorithm%-Hash von "%FileName%
echo Hash wird berechnet...

powershell "Get-FileHash -LiteralPath '%File%' -Algorithm %Algorithm% | Format-List"

pause > nul
`);

        let befehl = `
New-Item 
'${normal}',
'${normal}\\shell',
'${normal}\\shell\\01SubCmd',
'${normal}\\shell\\01SubCmd\\command',
'${normal}\\shell\\02SubCmd',
'${normal}\\shell\\02SubCmd\\command',
'${normal}\\shell\\04SubCmd',
'${normal}\\shell\\04SubCmd\\command',
'${normal}\\shell\\05SubCmd',
'${normal}\\shell\\05SubCmd\\command' -Force;`;
befehl = befehl.replace(/\n/g, "");

let befehl2 = `
Set-ItemProperty '${escaped}' -Name MUIVerb -Type String -Value 'Datei Hash erzeugen mit' -Force;
Set-ItemProperty '${escaped}' -Name SubCommands -Type String -Value '' -Force;
Set-ItemProperty '${escaped}\\shell\\01SubCmd' -Name 'MUIVerb' -Type String -Value 'SHA1' -Force;
Set-Item '${escaped}\\shell\\01SubCmd\\command' -Force -Type String -Value '"${appDataPath}\\filehasher.bat" "%1" "SHA1"';
Set-ItemProperty '${escaped}\\shell\\02SubCmd' -Name 'MUIVerb' -Type String -Value 'SHA256' -Force;
Set-Item '${escaped}\\shell\\02SubCmd\\command' -Force -Type String -Value '"${appDataPath}\\filehasher.bat" "%1" "SHA256"';
Set-ItemProperty '${escaped}\\shell\\04SubCmd' -Name 'MUIVerb' -Type String -Value 'SHA512' -Force;
Set-Item '${escaped}\\shell\\04SubCmd\\command' -Force -Type String -Value '"${appDataPath}\\filehasher.bat" "%1" "SHA512"';
Set-ItemProperty '${escaped}\\shell\\05SubCmd' -Name 'MUIVerb' -Type String -Value 'MD5' -Force;
Set-Item '${escaped}\\shell\\05SubCmd\\command' -Force -Type String -Value '"${appDataPath}\\filehasher.bat" "%1" "MD5"';`

        //BUGFIX: Ich weiß nicht warum, aber so geht es am schnellsten...
        powershell.runAsync(befehl, () => {

            befehl2 = befehl2.replace(/\n/g, "").split(";");

            befehl2.forEach(element => {
                powershell.runSync(element);
            });

            configs.get["filehasher:enabled"](callBack);

        })

    } else {

        powershell.runSync(`Remove-Item -Path '${escaped}' -Force -Recurse`);
        try {
            fs.unlinkSync(appDataPath + "/filehasher.bat");
        } catch (error) {}
        configs.get["filehasher:enabled"](callBack);

    }

}


// ------------------------------------------------------------------


configs.get["firewall:enabled"] = (callBack) => {
    
    powershell.runAsync(`Test-Path '${getHKCU()}\\Software\\Classes\\Directory\\shell\\Firewall'`, (err, res) => {

        callBack(false, (res.replace("\r\n", "") === "True") ? true : false);
    
    })
    
}
configs.set["firewall:enabled"] = (value, callBack) => {

    const fpath =  `${getHKCU()}\\Software\\Classes\\Directory`;
    const pathShell =  `${fpath}\\shell\\Firewall`;

    if (value) {


        fs.writeFileSync(appDataPath + "/blockfolder.bat", `
@echo off

net session >nul 2>&1
if %errorLevel% == 0 (
    goto gotAdmin
) else (
    echo Administrativen Privilegien werden beantragt...
    powershell.exe Start-Process -Verb runAs -FilePath %0 -ArgumentList %1
    exit /B
)


:gotAdmin

@setlocal enableextensions
@setlocal EnableDelayedExpansion

color 06
title Firewall

set location=%1
@cd /d "%location%"

echo.
echo. ========================================================
echo.  Firewall 1.0
echo.  Homepage: https://gist.github.com/otsmr/
echo. ========================================================
echo.
echo. Folgenden Anwendungen
echo. in %location%
echo. mithilfe der Firewall blockieren.
echo.
echo. ------------------------------------------
FOR /r %%B in (*.exe) do (echo.   %%~nxB)
echo. ------------------------------------------
echo.

CHOICE /C jn /M "> Anwendungen blockieren"
IF Errorlevel 2 goto EXIT
IF Errorlevel 1 goto ADD

:ADD
echo. 
set /p add="> Name der Regel: "

:block
set c=0
echo.
echo.  Eingehende Regeln:
echo. ------------------------------------------
FOR /r %%B in (*.exe) do (
    set /a c=!c!+1
    echo.  !c!. '%%~nxB' wird blockiert... 
    netsh advfirewall firewall add rule name="%add% (%%~nxB)" dir=in action=block program="%%~dpfnxB"
)
echo. ------------------------------------------
echo. 
echo.  Ausgehende Regeln:
echo. ------------------------------------------
set c=0
FOR /r %%B in (*.exe) do (
    set /a c=!c!+1
    echo.  !c!. '%%~nxB' wird blockiert...
    netsh advfirewall firewall add rule name="%add% (%%~nxB)" dir=out action=block program="%%~dpfnxB"
)
echo. ------------------------------------------
echo. 
CHOICE /C jn /M "> Windows Firewall oeffnen?
IF Errorlevel 2 goto EXIT
IF Errorlevel 1 goto OPEN


:OPEN
start "C:\Windows\System32" rundll32.exe shell32.dll,Control_RunDLL firewall.cpl
Goto EXIT


:EXIT
exit
        `);



        let befehl = `
if ((Test-Path '${fpath}') -eq $false) { New-Item '${fpath}'; };
if ((Test-Path '${fpath}\\shell') -eq $false) { New-Item '${fpath}\\shell'; };
New-Item 
'${pathShell}',
'${pathShell}\\command' -Force`;
befehl = befehl.replace(/\n/g, "");

let befehl2 = `
Set-Item '${pathShell}' -Type String -Value 'Firewall: Anwendungen hier blockieren' -Force;
Set-Item '${pathShell}\\command' -Force -Type String -Value '"${appDataPath}\\blockfolder.bat" "%1"';`

        //BUGFIX: Ich weiß nicht warum, aber so geht es am schnellsten...
        powershell.runAsync(befehl, () => {

            befehl2 = befehl2.replace(/\n/g, "").split(";");

            befehl2.forEach(element => {
                powershell.runSync(element);
            });

            configs.get["firewall:enabled"](callBack);

        })

    } else {

        powershell.runSync(`Remove-Item -Path '${pathShell}' -Force -Recurse`);
        try {
            fs.unlinkSync(appDataPath + "/blockfolder.bat");
        } catch (error) {}
        configs.get["firewall:enabled"](callBack);

    }

}

module.exports = configs;