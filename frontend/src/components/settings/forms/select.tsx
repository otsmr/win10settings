import React from "react";

import "../../../assets/style/forms/select.sass";

import socket from "../../../utilitis/socket"
import { syncThemeMode } from "../../../utilitis/utils";
import Loader from "./../../design/loader";

interface IProps {
    options: {
        title: string,
        value: string
    }[],
    configID: string,
}
interface IStats {
    selected: string,
    isLoading: boolean,
    message: string | boolean
}

export default class Select extends React.Component<IProps, IStats> {

    constructor (props: IProps) {
        super(props);

        this.state = {
            selected: "",
            isLoading: false,
            message: ""
        };

    }

    onChange = () => {

        const select: any = this.refs.select;

        this.setState({
            selected: select.value,
            isLoading: true
        })

        setTimeout(() => {

            socket.post({id: this.props.configID, method: "set", body: { value: this.state.selected} }, (err: boolean, value: string) => {

                if (err) return this.displayMessage(value);
                syncThemeMode();
                
                this.setState({
                    selected: value,
                    isLoading: false
                })
    
            });

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

        this.setState({ isLoading: true })

        socket.post({id: this.props.configID, method: "get" }, (err: boolean, value: string) => {

            if (err) return this.displayMessage(value);
            
            this.setState({
                selected: value,
                isLoading: false
            })

        });

    }

    render () {

        return (
            
            <div>
                <div className="select-container">
                    <div className="select">
                        <select ref="select" value={this.state.selected} onChange={this.onChange}>
                            {this.props.options.map(item => (
                                <option key={item.value} value={item.value}>{item.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="loader-container" data-isloading={this.state.isLoading}>
                        <Loader />
                    </div>
                </div>
                <p className="message">{this.state.message}</p>
            </div>

        )

    }

}