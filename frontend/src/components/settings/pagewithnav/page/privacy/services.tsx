import React from "react";

import Toggle from '../../../forms/toggle';
import A from "./../../../forms/a"

const BSI_BERICHT_LINK = "https://web.archive.org/web/20190911091237/https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Cyber-Sicherheit/SiSyPHus/Analyse_Telemetriekomponente.pdf?__blob=publicationFile&v=5";

export default class Services extends React.Component{

    render () {

        return (
            <div>

                <h2>Benutzererfahrung und Telemetrie im verbundenen Modus (diagtrack)</h2>
                <p> Der DiagTrack-Dienst sendet erhobenen Daten an verschiedene Hosts des Telemetrie-Backends von Microsoft. </p>
                <label>Dienst deaktivieren <sup>1</sup></label>
                <Toggle configID="privacy:services:diagtrack" offText="Aus" onText="An" />
                <p><A href={BSI_BERICHT_LINK}>Mehr Informationen</A></p>



                <h2>WAP-Push-Nachrichten Routing-Dienst (dmwappushservice)</h2>
                <p> Routet vom Gerät empfangene WAP-Push-Nachrichten (Wireless Application Protocol) und synchronisiert Geräteverwaltungssitzungen. </p>
                <label>Dienst deaktivieren <sup>2</sup></label>
                <Toggle configID="privacy:services:dmwappushservice" offText="Aus" onText="An" />



                <h2>Dienst für Einzelhandelsdemos (retaildemo)</h2>
                <p> Der Dienst für Einzelhandelsdemos steuert die Geräteaktivität, während sich das Gerät im Modus für Einzelhandelsdemos befindet. </p>
                <label>Dienst deaktivieren <sup>2</sup></label>
                <Toggle configID="privacy:services:retaildemo" offText="Aus" onText="An" />

            </div>

        )

    }

}
