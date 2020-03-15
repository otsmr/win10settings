
const { ipcRenderer, ipcMain } = require("electron");

module.exports = {

    emit (id, a = null, b = null, c = null, d = null) {

        const rand = Math.round(Math.random() * 10000000000);

        let func = ()=>{};
        if (typeof a === "function") func = a;
        if (typeof b === "function") func = b;
        if (typeof c === "function") func = c;
        if (typeof d === "function") func = d;

        process.mainWindow.webContents.send(id, rand, a, b, c, d);
        ipcMain.on(id + rand, func);

    },

    on (id, call) {

        ipcMain.on(id, (event, rand, a, b, c, d) => {
            if (a === null) call((a, b, c, d) => { event.reply(id+rand, a,b,c,d); });
            else if (b === null) call(a, (a, b, c, d) => { event.reply(id+rand, a,b,c,d); });
            else if (c === null) call(a, b, (a, b, c, d) => { event.reply(id+rand, a,b,c,d); });
            else if (d === null) call(a, b, c, (a, b, c, d) => { event.reply(id+rand, a,b,c,d); });                
        })

        return this;

    }

}