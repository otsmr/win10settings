import React from "react";
import Toggle from '../../../forms/toggle';

export default class Filehasher extends React.Component {

    render () {

        return (

            <div>
                <p>Erstellen Sie einen Datei-Hash-Wert mit einem Klick. Es wird SHA1, SHA256, SHA512 und MD5 unterstützt.</p>
                <label>Hash mit Rechtsklick erzeugen aktivieren <sup>1</sup></label>
                <Toggle configID="tools:filehasher:enabled" onText="Aktiviert" offText="Deaktiviert"/>
            </div>

        )

    }

}