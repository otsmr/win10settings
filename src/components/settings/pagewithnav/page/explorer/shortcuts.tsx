import React from "react";

import socket from "../../../../../utilitis/socket"

import Liste from '../../../forms/liste';
import Loader from "./../../../../design/loader";

import { explorerImages } from "../../../../../assets/img/index";

interface IProps {}
interface IState {
    thispc: any[],
    programsFolder: any[],
    isThisPcLoading: boolean,
    isProgramsLoading: boolean
}

export default class extends React.Component<IProps, IState > {

    constructor (props: IProps) {
        super(props);

        this.state = {
            thispc: [],
            programsFolder: [],
            isThisPcLoading: true,
            isProgramsLoading: true
        }

    }

    onChange = (itemID: string, value: boolean) => {

        const itemType: string = itemID.split(":")[0];

        const configID = "explorer:shortcuts:" + itemType;
        const id = itemID.split(":")[1];

        socket.emit("setConfig", configID, {
            id, value
        }, (itemType === "thispc") ? this.setThisPCItems : this.setProgramFolders);
        
    }

    setThisPCItems = (err: boolean, thisPCItems: any) => {

        const images:any = explorerImages;

        if (err) {
            this.setState({ isThisPcLoading: false })
            return console.error(thisPCItems);
        }
        
        thisPCItems = thisPCItems.map((e: any) => { return {
            ...e,
            id: "thispc:" + e.id,
            icon: (images[e.id]) ? images[e.id] : null
        }})

        this.setState({
            thispc: thisPCItems,
            isThisPcLoading: false
        })

    }

    setProgramFolders = (err: boolean, programFolders: any) => {

        if (err) {
            this.setState({
                isProgramsLoading: false
            })
            return console.error(programFolders);
        }

        programFolders = programFolders.map((e: any) => { return {
            ...e,
            id: "programFolders:" + e.id
        }})

        this.setState({
            programsFolder: programFolders,
            isProgramsLoading: false
        })

    }

    componentDidMount () {

        this.setState({
            isThisPcLoading: true,
            isProgramsLoading: true
        })

        socket.emit("getConfig", "explorer:shortcuts:thispc", this.setThisPCItems);
        socket.emit("getConfig", "explorer:shortcuts:programFolders", this.setProgramFolders)

    }

    render () {

        return (

            <div>

                <h2>Dieser PC</h2>
                <div className="loader-container" data-isloading={this.state.isThisPcLoading}>
                    <Loader />
                </div>
                <Liste listitems={this.state.thispc} onChange={this.onChange} checkbox={true} width="150px"/>


                <h2>Programm Ordner</h2>
                <div className="loader-container" data-isloading={this.state.isProgramsLoading}>
                    <Loader />
                </div>
                <Liste listitems={this.state.programsFolder} onChange={this.onChange} checkbox={true} width="150px"/>

            </div>
            
        )

    }

}