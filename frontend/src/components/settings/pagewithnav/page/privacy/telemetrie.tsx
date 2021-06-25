import React from "react";
import Toggle from '../../../forms/toggle';

export default class Telemetrie extends React.Component{

    render () {

        return (
            <div>

                <p className="note">Im Abschnitt Dienste und Windows Defender gibt es noch mehr Einstellungen zur Telemetrie.</p>

                <h2>Allgemein</h2>
                <p> Microsoft Telemetrie ist eine Komponente in Windows 10, die  für die automatische Erhebung und Übertragung von Daten verantwortlich ist. Bei den erhobenen Daten handelt es sich um unterschiedliche Daten wie z. B.: Daten über die Nutzung des Computers unter Windows 10 und der an ihn angeschlossenen Geräte, Daten über die Performance des Systems, Daten, die bei Fehlern, wie Programm- oder Systemabstürzen erhoben werden. </p>

                <label>Das niedrigst mögliche Telemetrie-Level verwenden <sup>1, 4</sup></label>
                <Toggle configID="privacy:telemetrie:allowtelemetry" onText="An" offText="Aus" />
                <br />

                <label>Werbe-ID, Zugriff auf Sprachliste und Start Nachverfolgung deaktivieren <sup>5, 6</sup></label>
                <Toggle configID="privacy:telemetrie:basicPrivacySettings" offText="Aus" onText="An" />

                <h2>Bekannte Trackingdomains blockieren</h2>
                <p> Vor jedem Verbindungsaufbau zum Telemetrie-Backend von Microsoft erfolgt zunächst die Auflösung des DNS-Namens des Telemetrie-Backend-Hosts in dessen zugehörige IP-Adresse. Windows Betriebssysteme versuchen DNS-Namen über Einträge in der lokalen Hosts-Datei aufzulösen, bevor sie einen DNS-Server abfragen. Diesen Umstand kann man sich zunutze machen, um allen bekannten Hostnamen von Telemetrie-Endpunkten von Microsoft die IP-Adresse 0.0.0.0 zuzuordnen. Da die IP-Adresse 0.0.0.0 nicht routing-fähig ist, zeigen die dieser Adresse zugeordneten DNS-Namen „ins Leere“, und können damit nicht erreicht werden. Dementsprechend können die dort aufgelisteten Telemetrie-Backend-Hosts nicht erreicht werden. </p>
                <label>Domains über die Hosts-Datei blockieren<sup> 2, 3</sup></label>
                <Toggle configID="privacy:telemetrie:blockDomainsWithHosts" offText="Aus" onText="An" />
                <p className="note">Um zu verhindern, dass Windows Defender diese Einstellung zurücksetzt, wird die "hosts"-Datei auf die Ausschlussliste <sup>7</sup> gesetzt <sup>8</sup>.</p>


                <h2>Feedbackhäufigkeit</h2>
                <p>Das Feedback wird von Windows automatisch angefordert.</p>
                <label>Feedbackhäufigkeit auf "Nie" setzen <sup>4</sup></label>
                <Toggle configID="privacy:telemetrie:requestFeedback" onText="An" offText="Automatisch" />

            </div>
        )

    }

}