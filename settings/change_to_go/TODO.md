=> change this to a powershell script or a standalone C program


# Required functions

```c++

bool start_server(); // -> starts the neutralino server
bool is_admin();
void restart_as_admin();
// -> Start-Process -FilePath '$' -Verb runAs -ArgumentList ${modulePath} "--userData", "$"


bool restart_explorer();
// $ taskkill /IM explorer.exe /f; Start-Process explorer.exe;
bool open_msgconfig();
// $ msconfig


bool open_url_in_browser(char * url);
bool open_file(char * path);


bool system_theme_mode(); // 0 -> light, 1 -> dark


bool check_for_updates();
// https://api.github.com/repos/otsmr/win10settings/releases

```


```js
.on("getConfig", (configID, callBack) => {

    const config = getConfig(configID, "get");
    if (!config) return callBack(true, "Einstellung nicht gefunden")
    
    config(callBack);

})

.on("setConfig", (configID, value, callBack) => {

    const config = getConfig(configID, "set");
    if (!config) return callBack(true, "Einstellung nicht gefunden");

    config(value, callBack);

})
```


## needed neutralino functions

```js
switch (action) {
    case "close": app.quit(); break;
    case "minimize": window.minimize(); break;
    case "toggleMaximize": 
        if (window.isMaximized()) window.restore();
        else window.maximize();
        callBack(window.isMaximized());
    break;
}
```