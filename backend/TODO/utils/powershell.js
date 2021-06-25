// const fs = require("fs");
// const path = require("path");

// const { app } = require("electron");
// const { 
//     spawnSync,
//     spawn
// } = require('child_process');

const log = require("./logs");

const Shell = require('node-powershell');

class PowerShell {
    
    constructor () {
        
        this.ps = new Shell({
            executionPolicy: 'Bypass',
            verbose: true
        });

        this.isBlocked = false;
        
    }
    
    exit () {
        this.ps.dispose();
    }

    run (command, call = () => {}) {

        if (this.isBlocked) {
            return setTimeout(() => {
                this.run(command, call);
            }, 50);
        }

        command = command.replace(/\n/g, "");

        this.isBlocked = true;
        const timeStart = log.time();

        this.ps.addCommand(command);
        
        this.ps.invoke()
        .then(output => {
            call(false, output);
            log.debug("powershell", `Zeit: ${(log.time() - timeStart) / 1000}s\n` + command);
        })
        .catch(err => {
            call(true, err);
            log.error("powershell", `Zeit: ${(log.time() - timeStart) / 1000}s\n${command}\n\n${err.toString()}`);
        })
        .finally(e => {
            this.isBlocked = false;
        })

    }
    
    getJson (command, params, call) {

        if (params.length > 0) {
            command += ` | Select-Object -Property '${params.join("', '")}'`
        }
        
        command += " | ConvertTo-Json -Compress";

        this.run(command, (err, output) => {
            if (err) return call(err, output);
            try {
                call(false, JSON.parse(output));
            } catch (error) {
                call(true, error.toString());
                log.error("powershell", `${command}\n\n${error.toString()}`);
            }
        });
    
    }

    runAsAdmin (command, call) {

        command = command.replace(/"/g, "'\"");

        if (!process.isAdmin) 
            command = `Start-Process powershell -WindowStyle Minimized -Wait -Verb runAs -ArgumentList "${command}"`;
        
        return this.run(command, call);
        
    }
    
}

module.exports = new PowerShell();