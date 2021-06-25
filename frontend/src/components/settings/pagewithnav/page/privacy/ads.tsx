import React from "react";
import Toggle from '../../../forms/toggle';

export default class Privacy extends React.Component{

    render () {

        return (

            <div>
                <h2>Werbung in Windows 10</h2>
                <p>Microsoft hat mit Windows 10 Werbung eingeführt, die auf den Benutzer zugeschnitten ist. Diese App-Vorschläge und Tipps können jedoch recht ärgerlich sein, da sie nicht nur im Startmenü, sondern auch auf dem Sperrbildschirm erscheinen. </p>
                <label>Werbung soweit es geht deaktivieren<sup> 1, 2</sup></label>
                <Toggle configID="privacy:ads:displayAds" offText="Aus" onText="An" />
            </div>

        )

    }

}