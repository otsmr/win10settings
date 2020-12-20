import React from "react";

import "../../../assets/style/forms/toggle.sass";

import socket from "../../../utilitis/socket"
import Loader from "./../../design/loader";

interface IProps {
    onText?: string,
    configID: string,
    offText?: string,
    onChange?: Function
}
interface IStats {
    checked: boolean,
    isLoading: boolean,
    message: string | boolean
}

export default class extends React.Component<IProps, IStats> {

    constructor (props: IProps = {
        onText: "An",
        offText: "Aus",
        configID: ""
    }) {
        super(props);

        this.state = {
            checked: false,
            isLoading: false,
            message: ""
        };

    }

    onChange = () => {

        const input: any = this.refs.input;

        this.setState({
            checked: input.checked,
            isLoading: true
        })

        setTimeout(() => {

            socket.emit("setConfig", this.props.configID, this.state.checked, (err: boolean, value: boolean | string) => {

                if (err) {
                    this.setState({
                        checked: !this.state.checked
                    })
                    return this.displayMessage(value);
                }

                if (typeof value !== "boolean") return;

                this.setState({
                    checked: value,
                    isLoading: false
                })

                if (this.props.onChange) {
                    this.props.onChange(this.state.checked);
                }
    
            })

        }, 50);

    }

    displayMessage (message: string | boolean) {

        this.setState({
            isLoading: false,
            message: "Fehler: " + message.toString()
        })
        setTimeout(() => {
            this.setState({
                isLoading: false,
                message: ""
            })
        }, 5000);

    }

    componentDidMount () {

        if (this.props.configID === "") return;

        this.setState({
            isLoading: true
        })

        socket.emit("getConfig", this.props.configID, (err: boolean, value: boolean) => {

            if (err) return this.displayMessage(value);
            
            this.setState({
                checked: value,
                isLoading: false
            })

        })

    }

    render () {

        return (
            <div className="toggle-container">
                <div className="toggle">
                    <input ref="input" disabled={this.props.configID === ""} onChange={this.onChange} checked={this.state.checked} type="checkbox" data-checked={this.state.checked} />
                    <label>{(this.state.checked) ? this.props.onText : this.props.offText}</label>
                </div>
                <p className="message">{this.state.message}</p>
                <div className="loader-container" data-isloading={this.state.isLoading}>
                    <Loader />
                </div>
            </div>
        )

    }

}