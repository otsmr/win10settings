
const fs = require("fs");
const path = require("path");

const { app } = require("electron");
const { 
    spawnSync,
    spawn
} = require('child_process');

const log = require("./logs");


module.exports = new class {

    runAsAdmin (befehl) {

        befehl = befehl.replace(/"/g, "'\"");

        if (!process.isAdmin) 
            befehl = `Start-Process powershell -WindowStyle Minimized -Verb runAs -ArgumentList "${befehl}"`;
        
        return this.runSync(befehl);
        
    }

    runSync (befehl) {

        const timeStart = log.time();
        
        try {

            const out = spawnSync("powershell.exe", [befehl], {
                encoding : 'utf8'
            }).stdout;
            
            log.debug("powershell", `runSync (Zeit: ${(log.time() - timeStart) / 1000}s)\n${befehl}`);
            return out;

        } catch (error) {
            log.error("powershell", `runSync (Zeit: ${(log.time() - timeStart) / 1000}s)\n${befehl}\n\n${error.toString()}`);
            return null;
        }

    }

    runAsync (befehl, callBack) {

        const timeStart = log.time();

        try {

            let res = "";
            const search = spawn("powershell.exe", [befehl], { 
                encoding : 'utf8'
            });

            search.on('close', code => {
                if (code === 0) callBack(false, res);
                else callBack(false, null);

                log.debug("powershell", `runAsync (Zeit: ${(log.time() - timeStart) / 1000}s)\n` + befehl);

            });

            search.stdout.on('data', (data) => {
                res += data;
            });

        } catch (error) {
            log.debug("powershell", "FEHLER runAsync (Zeit: ${(log.time() - timeStart) / 1000}s)\n" + befehl + "\n" + error.toString());
            callBack(true, error);
        }

    }

    getJSONAsync (befehl, params = ["*"], callBack) {

        const rand = parseInt(String(Math.random()).replace(".", ""));

        const tmpFilePath = path.join(app.getPath("temp"), `/ps-output.${rand}.json`);

        const jsonBefehl = this._getJSONBefehl(befehl, params, tmpFilePath);

        this.runAsync(jsonBefehl, (err, res) => {
            if (err) return callBack(true, res);

            this._getJSONResult(tmpFilePath, (err, json)=>{
                if (err) return callBack(true, json);
                callBack(false, json);
            })

        })

    }

    _getJSONBefehl (befehl, params, tmpFilePath) {

        if (params.length > 0) {

            befehl += ` | Select-Object -Property '${params.join("', '")}'`
            befehl += ` | ConvertTo-Json`

            // Die Ausgabe wir in eine Datei umgeleitet,
            // da es sonst Probleme bei der Encoding gibt
            befehl += ` | Out-File '${tmpFilePath}' -Encoding UTF8`

        }
        
        return befehl;

    }
    
    _getJSONResult (tmpFilePath, callBack) {

        fs.readFile(tmpFilePath, (err, data) => {
            if (err) return callBack(true, err);

            data = data.toString();
            fs.unlinkSync(tmpFilePath);

            if (data === "") return callBack(true, "Keine Ausgabe von Powershell erhalten");

            data = data.substr(1); // Bug Fix: Das '﻿'-Zeichen am Anfang der Datei wird entfernt
            if (data === "") return [];

            const match = data.match(/:(.*?)"(.*?)"(.*?)"(.*?)"(.*?),/g);

            if (match) for (const item of match) {
                let part = item.substr(1).slice(0, -2).trim();
                if (part[0] === '"') part = part.substr(1);
                part = part.replace(/\\\"/g, '\"').replace(/\"/g, '"').replace(/"/g, '\\"');
                data = data.replace(item, `:  "${part}",`)
            }

            try {

                callBack(false, JSON.parse(data));

            } catch (error) {
                callBack(true, error);
            }

        })
        
    }
    
}