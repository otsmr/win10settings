import React from "react";

import socket from "../../../../../utilitis/socket"

import Loader from "./../../../../design/loader";
import Liste from '../../../forms/liste';
import Toggle from "../../../forms/toggle";

interface IProps {}

interface IState {
    applist: any[],
    isLoading: boolean,
    btnText: string
}

export default class WinApps extends React.Component<IProps, IState> {

    checkedApps: any[] = []

    constructor (props: IProps) {
        super(props);

        this.state = {
            applist: [],
            btnText: "Apps werden geladen",
            isLoading: true
        }
    }

    onChange = (appID: string, value: boolean) => {

        if (value) {
            this.checkedApps.push(appID);
        } else this.checkedApps.splice(this.checkedApps.indexOf(appID), 1)
    
    }

    startToRemoveApps = () => {

        if (this.checkedApps.length === 0) return;

        this.setState({
            applist: [],
            isLoading: true,
            btnText: "Apps werden entfernt"
        })

        socket.post({id: "programs:winapps:appliste", method: "set", body: { checkedApps: this.checkedApps } }, this.setConfig);
        
    }

    setConfig = (err: boolean, applist: any) => {
        if (err) return console.error(applist);

        this.checkedApps = [];

        applist.forEach((app: any) => {
            if (app.checked) this.checkedApps.push(app.id);
        });
    
        this.setState({
            applist,
            btnText: "Ausgewählte Apps deinstallieren",
            isLoading: false
        })

    }

    updateList = () => {

        this.setState({
            isLoading: true,
            applist: []
        })
        
        socket.post({id: "programs:winapps:appliste", method: "get", }, this.setConfig);

    }

    componentDidMount () {
        this.updateList();
    }

    render () {

        return (
            <div>
                <h2>Optionen</h2>
                <label>Diese Liste filtern</label>
                <Toggle configID="app:config:winapps_filter_systemapps" onChange={this.updateList} />

                <h2>Appliste</h2>
                <button className="btn" onClick={this.startToRemoveApps} disabled={this.state.isLoading}>{this.state.btnText}</button>
                <br />
                <br />
                <div className="loader-container" data-isloading={this.state.isLoading}>
                    <Loader />
                </div>
                <Liste listitems={this.state.applist} checkbox={true} onChange={this.onChange} />
                
            </div>
        )

    }


}