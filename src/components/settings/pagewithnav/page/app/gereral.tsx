import React from "react"

import Select from "../../../forms/select"
import socket from "../../../../../utilitis/socket";


export default () => {

    const options = [
        { title: "System", value: "system" },
        { title: "Dunkel", value: "dark" },
        { title: "Hell", value: "light" }
    ]

    return (
        <div>

            <h2>Logs</h2>
            <p> Jede Einstellung, die von diesem Programm geändert wird, wird automatisch protokolliert. Alle Protokolle sind unter <b>%appdata%/win10settings/userData/logs</b> zu finden. Die wichtigste Protokolldatei ist die Datei "powershell.log" bzw. "error-powershell.log". Hier wird jeder Powershell-Befehl mit zusätzlichen Informationen protokolliert. </p>
            <button className="btn" onClick={()=>{socket.emit("openLogFolder")}}>Log-Ordner öffnen</button>

            <h2>Theme</h2>
            <Select configID="app:gereral:themeMode" options={options} />

        </div>
    )

}
