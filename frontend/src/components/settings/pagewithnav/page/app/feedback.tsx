import React from "react"

import A from "../../../forms/a"
import Loader from "../../../../design/loader";

interface IProps {}
interface IState {
    sent: boolean,
    isSending: boolean,
    statusMsg: string
}

export default class Feedback extends React.Component<IProps, IState> {

    constructor (props: IProps) {
        super(props);
        this.state = {
            sent: false,
            isSending: false,
            statusMsg: "",
        }
    }

    sendFeedback = () => {

        const title: any = this.refs.title;
        const nachricht: any = this.refs.nachricht;
        this.setState({
            isSending: true
        })

        const body = new FormData();    
        body.append( 'email', "win10settings" );
        body.append( 'titel', title.value );
        body.append( 'nachricht', nachricht.value );

        fetch("https://osend.de/", {
            method: "POST",
            body
        }).then((response) => {
            return response.text();
        }).then((data) => {

            this.setState({
                sent: true,
                statusMsg: "Ihre Anfrage wurde erfolgreich versendet.",
                isSending: false
            })

            let statusMsg = "Aber die Nachricht konnte nicht gesendet werden.";
            if (data.indexOf("Erfolgreich gesendet") > -1) {
                statusMsg = "Ihre Anfrage wurde erfolgreich versendet.";
            }
            this.setState({statusMsg})

            setTimeout(() => {
                this.setState({ sent: false })
            }, 10000);
            
        });

    }

    render () {

        return (
            <div>

                {(this.state.sent) ? (
                    <p>
                        Vielen Dank für das Feedback.
                        <br />
                        {this.state.statusMsg}
                    </p>
                ) : ((this.state.isSending) ? (
                    <Loader />
                ) : (
                    <div>

                        <h2>Problembericht / Featureanforderung</h2>
                        <p>Wenn Sie eine Antwort möchten, geben Sie bitte Ihre E-Mail in der Nachricht an.</p>
                        <input className="text" ref="title" placeholder="Betreff" type="text" /><br />
                        <textarea className="text" ref="nachricht" placeholder="Nachricht"></textarea><br />
                        <button className="btn" onClick={this.sendFeedback}>Abschicken</button>
                        <br />
                        <br />
                        <A href="https://oproj.de/privacy">Datenschutzerklärung</A><br />

                    </div>
                ))}
                
            </div>

        )

    }

}