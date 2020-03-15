/* ######################

   Globale Variabeln

    > process

        userData:string
        > Ordner zum Speichern der Benutzerdaten

        mainWindow:BrowserWindow
        > Electron-Fenster

        isAdmin:boolean
        > Läuft das Programm mit Administratorrechten

        isDev:boolean
        > Programm in Development
   

/* ###################### */


// Dies muss zuerst angefordert werden,
// da die process.userData hier gesetzt werden

const { setUserDataFolder, checkForUpdates } = require("./electron/utils/utilis");
setUserDataFolder();


const URL = require('url').URL
const { app, BrowserWindow } = require('electron');
const isDev = require("electron-is-dev");
const path = require("path");
process.isDev = isDev;

const appconfig = require("./electron/utils/appconfig");
const ipcEvents = require("./electron/ipcEvents");
const {
    getCurrentUsers,
    runningAsAdministrator
} = require("./electron/utils/powershell-utils");


const loadURL = (window) => {

    window.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    if (isDev) window.webContents.openDevTools({
        mode: "undocked"
    })

    checkForUpdates();

}

// Nur lokale Verbindung erlauben
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl)
        if (parsedUrl.origin !== 'http://localhost:3000' || parsedUrl.origin.startsWith("file://")) {
            event.preventDefault()
        }
    })
})

app.on('ready', () => {

    const window = process.mainWindow = new BrowserWindow({
        width: 1300,
        height: 810,
        show: true,
        frame: false,
        title: 'Erweiterte Einstellungen',
        webPreferences: {
            nodeIntegration: false,
            preload: __dirname + '/electron/preload.js',
            webSecurity: false
            // webSecurity ist deaktiviert damit lokale Bilder geladen werden dürfen 
            // Fehler: Not allowed to load local resource: [...]
        }
    });

    ipcEvents(window);

    window.setMenu(null);


    runningAsAdministrator((err, isAdmin) => {

        process.isAdmin = isAdmin;


        // Wenn der normale Benutzer keine Administratorrechte hat wird das Programm
        // beim öffnen mit Adminrechten unter einem anderen Benutzer ausgeführt

        if (isAdmin) return loadURL(window);

        getCurrentUsers((err, items) => {

            if (!err) {
                appconfig.set("HKEY_CURRENT_USER", items.hkcu);
                appconfig.set("CURRENT_USER_SID", items.sid);
            }

            loadURL(window);

        });

    })

});