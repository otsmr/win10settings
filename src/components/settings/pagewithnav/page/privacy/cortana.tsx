import React from "react";

import Toggle from '../../../forms/toggle';
import A from '../../../forms/a';

export default class extends React.Component{

    render () {

        return (

            <div>

                <h2>Websuche und Cortana deaktivieren</h2>
                <p>Eingegebene Suchbegriffe in der Windows Suche werden an Microsofts Suchdienst Bing übertragen um passende Vorschläge anzuzeigt. </p>
                <label>Websuche deaktivieren <sup>1</sup></label>
                <Toggle configID="privacy:cortana:websearch" offText="Aus" onText="An" />


                <h2>Bing deaktivieren</h2>
                <p> Diese Einstellung verhindert, dass Windows eine Verbindung zu Bing herstellen kann. </p>
                <label>Domains über die Hosts-Datei blockieren</label>
                <Toggle configID="privacy:cortana:blockDomainsWithHosts" offText="Aus" onText="An" />
                <p className="note">Diese Option blockiert den Zugriff auf bing.com in allen Programmen.</p>


                <h2>MSN deaktivieren</h2>
                <p> Der (neue und alte) Edge-Browser von Windows stellt beim Start automatisch eine Verbindung zu den Servern von MSN her. Dies kann in den Einstellungen des Edge-Browsers nicht verhindert werden (Stand:  Februar 2020). Um msn.com zu blockieren, reicht es leider nicht aus, die hosts-Datei zu manipulieren <sup> 2</sup>. </p>
                <label>Abhilfe kann hier aber das Pi-Hole geben.</label>
                <A href="https://pi-hole.net/">Pi-Hole-Installationsanleitung</A><br />
                <A href="https://github.com/RPiList/specials">Weitere Informationen zum Pi-Hole</A>

            </div>

        )

    }

}