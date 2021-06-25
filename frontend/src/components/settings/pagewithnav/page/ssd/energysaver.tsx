
import React from "react";
import Toggle from '../../../forms/toggle';

import socket from "../../../../../utilitis/socket";

interface IProps {}
interface IState {
    MediaType: string,
    FriendlyName: string
}

export default class Energysaver extends React.Component<IProps, IState > {

    constructor (props: IProps) {
        super(props);
        this.state = {
            MediaType: "",
            FriendlyName: ""
        }
    }

    componentDidMount () {

        socket.post({id: "ssd:energysaver:getSSDInfos", method: "get", }, (err: boolean, json: any) => {
            if (err) return;
            this.setState({
                MediaType: json.MediaType,
                FriendlyName: json.FriendlyName
            })
        });

    }

    render () {

        return (
            <div>
                {(this.state.FriendlyName !== "") ? (
                    <p className="note">Ihre Boot-Festplatte ({this.state.FriendlyName}) ist eine {this.state.MediaType}.</p>
                ) : ""}
                <h2>Ruhezustand</h2>
                <p>
                    Der Ruhezustand reduziert die Zeit, die Windows zum Starten von einer herkömmlichen Festplatte benötigt, erheblich. SSDs haben im Vergleich zu Festplatten deutlich geringere Zugriffszeiten, was bedeutet, dass der Startvorgang wesentlich kürzer ist. Systeme mit SSDs profitieren daher kaum vom Ruhezustand.<br />
                    Für den Ruhezustand legt Windows eine Datei auf dem Systemlaufwerk ab, die so groß ist wie der physische Speicher (RAM). Besonders bei kleineren SSDs kann die Deaktivierung des Ruhezustands wertvollen freien Speicherplatz auf der SSD freisetzen.
                </p>
                <label>Höchstleistung aktivieren <sup>1</sup></label>
                <Toggle configID="ssd:energysaver:restingState" onText="An" offText="Aus" />

                <label>Energiesparmodus deaktivieren <sup>1</sup></label>
                <Toggle configID="ssd:energysaver:hibernate" onText="An" offText="Aus" />

                <h2>Prefetch und Superfetch</h2>
                <p>Prefetch ist für die Speicherung häufig verwendeter Daten auf dem vorderen Teil der Festplatte verantwortlich. Superfetch speichert häufig verwendete Daten und Programme direkt im RAM. Beides ist bei der Lesegeschwindigkeit der SSD überflüssig. </p>
                <label>Prefetch und Superfetch deaktivieren <sup>1</sup></label>
                <Toggle configID="ssd:energysaver:prefetcher" onText='An' offText='Aus' />
                

                <h2>TRIM-Unterstützung</h2>
                <p>Mit dem Befehl ATA Trim teilt das Betriebssystem einem SSD mit, welche Datenbereiche nicht mehr benötigt werden und daher als gelöscht betrachtet werden können. Wenn die gesamte Kapazität eines SSDs genutzt wird, erhöht ATA Trim die Leistung und Lebensdauer des SSDs.</p>
                <label>TRIM-Unterstützung aktivieren <sup>1</sup></label>
                <Toggle configID="ssd:energysaver:trim" onText='An' offText='Aus' />


                {/* <h2>Festplatte</h2>
                <p></p>
                <label>Festplatte nicht ausschalten</label>
                <Toggle configID="ssd:energysaver:hardDisk" onText='An' offText='Aus' /> */}


                <h2>Autostart optimieren</h2>
                <p>
                    Wenn sehr viel Software installiert ist, die bei jedem Windows-Start geladen wird, verzögert dies den Startvorgang erheblich. <sup>1</sup>
                </p>
                <label>Danach den Tabreiter "Autostart" öffnen</label>
                <button className="btn" onClick={()=>{socket.post({id: "openMSConfig", method: "open"}, _ => {})}}>Autostart verwalten</button><br />

            </div>
        )

    }

}