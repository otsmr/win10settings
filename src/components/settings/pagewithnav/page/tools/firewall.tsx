import React from "react";
import Toggle from '../../../forms/toggle';

export default class extends React.Component {

    render () {

        return (

            <div>
                <p>Erstellen Sie eine Firewall-Regel mit einem Klick.</p>
                <label>Firewall mit Rechtsklick anlegen aktivieren <sup>1</sup></label>
                <Toggle configID="tools:firewall:enabled" onText="Aktiviert" offText="Deaktiviert"/>
            </div>

        )

    }

}