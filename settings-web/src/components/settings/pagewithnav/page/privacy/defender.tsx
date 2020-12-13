import React from "react";
import Toggle from '../../../forms/toggle';

export default class extends React.Component{

    render () {

        return (

            <div>
                <h2>Cloudbasierter Schutz</h2>
                <p>Die Komponente Cloud-BasedProtection des WindowsDefender dient dazu Informationen über verdächtige Software an Microsoft zu übermitteln. </p>
                <label>Cloudbasierten Schutz deaktivieren <sup>1</sup></label>
                <Toggle configID="privacy:defender:mapsreporting" offText="Aus" onText="An" />


                <h2>Automatische Übermittlung von Beispielen</h2>
                <p>Windows sendet Beispieldaten an Microsoft, um Sie vor potenziellen Bedrohungen zu schützen. Dabei kann es sich auch um Dateien mit persönlichen Informationen handeln.</p>
                <label>Automatische Übermittlung deaktivieren <sup>2</sup></label>
                <Toggle configID="privacy:defender:submitsamplesconsent" offText="Aus" onText="An" />
            </div>
        )

    }

}