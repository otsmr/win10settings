
import React from "react"
import Markdown from 'markdown-it';

import Toggle from '../../../forms/toggle'
import A from "../../../forms/a"

import socket from "../../../../../utilitis/socket";


const md = new Markdown();

interface IProps {}
interface IState {
    version: string,
    latest: string,
    changelog: string,
    releaseURL: string,
    downloadURL: string
}

export default class Update extends React.Component<IProps, IState> {

    constructor (props: IProps) {
        super(props);

        this.state = {
            version: "v0.0.0",
            latest: "v0.0.0",
            changelog: "",
            releaseURL: "",
            downloadURL: "",
        }

    }

    checkForNewUpdates () {

        fetch("https://api.github.com/repos/otsmr/win10settings/releases").then((response) => {
            response.json().then((json) => {

                if (!json[0]) return;

                this.setState({
                    releaseURL: json[0].html_url,
                    latest: json[0].tag_name,
                    downloadURL: json[0].assets[0]["browser_download_url"],
                    changelog: json[0].body
                })
            })
        });

    }

    componentDidMount () {

        socket.post({id: "app:env:version", method: "get"}, (err: boolean, version: string) => {
            if (err) return console.error(version);
            this.setState({
                version: "v" + version
            })
            this.checkForNewUpdates();
        });

    }

    render () {

        return (
            <div>

                <h2>Ihre Version ist <b>{this.state.version}</b>.</h2>

                { (this.state.latest <= this.state.version) ? (
                    <div>
                        <p>Zur Zeit gibt es keine Aktualisierungen.</p>
                        <br />
                        <label>Diese Version enthält die folgenden Änderungen:</label>
                        <div className="changelog" dangerouslySetInnerHTML={{__html: md.render(this.state.changelog)}}></div>
                    </div>
                ) : (
                    <div>
                        <p><b>Ein Update für Erweiterte Windows Einstellungen auf Version {this.state.latest} ist verfügbar!</b></p>
                        <A href={this.state.downloadURL}><button className="btn">Herunterladen</button></A>
                        <br /><br />
                        <label>Die neue Version enthält die folgenden Änderungen:</label>
                        <div className="changelog" dangerouslySetInnerHTML={{__html: md.render(this.state.changelog)}}></div>
                    </div>
                )}
                
                <h2>Automatisch nach Updates suchen</h2>
                <p> Bei jedem Start wird über Github geprüft, ob eine neue Version verfügbar ist. Wenn es eine neue Version gibt, erhalten Sie eine Benachrichtigung. </p>
                <Toggle configID="app:config:auto_update_check" offText="Aus" onText="An" />
                <A href="https://github.com/otsmr/win10settings/releases">Release Seite öffnen</A>
                
            </div>

        )

    }

}