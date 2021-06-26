import React from "react"

import Select from "../../../forms/select"
import socket from "../../../../../utilitis/socket";


export default function General () {

    const optionstheme = [
        { title: "System", value: "system" },
        { title: "Dunkel", value: "dark" },
        { title: "Hell", value: "light" }
    ]
    const optionsLanguages = [
        { title: "Deutsch", value: "de_DE" },
        { title: "English", value: "en_US" }
    ]

    return (
        <div>

            <h2>Sprache</h2>
            <Select configID="app:config:language" options={optionsLanguages} />
            
            <h2>Logs</h2>
            <p> Jede Einstellung, die von diesem Programm geändert wird, wird automatisch protokolliert. Alle Protokolle sind unter <b>%appdata%/win10settings/</b> zu finden.</p>
            <button className="btn" onClick={()=>{socket.post({id: "open_log_folder", method: "open"}, _ => {})}}>Log-Ordner öffnen</button>

            <h2>Theme</h2>
            <Select configID="app:config:theme" options={optionstheme} />


        </div>
    )

}
