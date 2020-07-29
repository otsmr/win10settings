const Shell = require('node-powershell');

class Powershell {
    
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
    
    
    getJson (command, call) {

        if (this.isBlocked) {
            return setTimeout(() => {
                this.getJson(command, call);
            }, 50);
        }

        this.isBlocked = true;
        
        command += " | ConvertTo-Json -Compress";
        
        this.ps.addCommand(command);
        
        this.ps.invoke()
        .then(output => {
            call(false, JSON.parse(output));
        })
        .catch(err => {
            call(true, err);
        })
        .finally(e => {
            this.isBlocked = false;
        })
    }
    
}

const command = "Get-MpPreference | Select-Object -Property 'SubmitSamplesConsent'";

const ps = new Powershell();
start = 0;
ps.getJson(command, (err, json) => {
    start = + new Date();
    console.log((+new Date() - start) / 1000, "s");
    if (err) return console.log(err);
    console.log(json);
})


ps.getJson(command, (err, json) => {
    console.log((+new Date() - start) / 1000, "s");
    if (err) return console.log(err);
    console.log(json);

    ps.exit()
})