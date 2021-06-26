import React from 'react';

import "../../assets/style/components/startpage.sass";

import Search from "./search";
import FluentItem from "../design/fluent"

import Translate from "../../utilitis/translate"
import TableOfContent from "./tableofcontent"

import socket from '../../utilitis/socket';

interface IProps {
    T: Translate,
    tableOfContent: TableOfContent,
    changeActivePage: Function
}
interface IState {
    fluentUseBorder: boolean,
    isAdmin: boolean
}

export default class Startpage extends React.Component<IProps, IState> {

    constructor (props: IProps) {
        super(props);

        this.state = {
            fluentUseBorder: true,
            isAdmin: true
        }

    }

    getTiles () {

        return this.props.tableOfContent.categories.map((item, index) => {
            return (

                <FluentItem 
                    useBorder={this.state.fluentUseBorder}
                    lightColor="var(--tile-fluent-light-color)"
                    backgroundColor="var(--page-background)"
                    contentBackgroundColorHover="var(--tile-background-hover)" 
                    key={item.id}
                    borderColor="var(--fluent-border-color)"
                    gradientSize={50}
                    onClick={() => { this.props.changeActivePage(item.id) }}>

                    <div className="icon">
                        <i className="m-icon">{item.icon}</i>
                    </div>
                    <div className="text">
                        <h2>{item.title}</h2>
                        <p>{item.desc}</p>
                    </div>
                </FluentItem>

            )
            
        })

    }

    componentDidMount () {

        socket.post({id: "app:env:isadmin", method: "get"}, (err: boolean, isAdmin: boolean) => {
            if (err) return;
            this.setState({ isAdmin })
        })

        const updateFluentBorder = () => {
            this.setState({
                fluentUseBorder: (window.innerWidth > 650)
            })
        }

        updateFluentBorder();
        window.addEventListener("resize", updateFluentBorder);

    }

    
    render() {

        return (

            <div className="startpage noselect">
                <div className="settings-title">
                    <h1>{this.props.T.t("SETTINGS_TITLE")}</h1>
                </div>
                <div className="search-container">
                    <Search tableOfContent={this.props.tableOfContent} changeActivePage={this.props.changeActivePage} placeholder={this.props.T.t("SETTINGS_SEARCH_PLACEHOLDER")}/>
                </div>
                <div className="tiles-container" ref="tiles-container">
                    {this.getTiles()}
                </div>
                <div className="getadmin" data-isadmin={this.state.isAdmin}>
                    <button onClick={()=>{ socket.post({id: "asadmin", method: "restart"}, _=>{}) }} className="btn-link">Als Administrator starten</button>
                </div>
            </div>

        )

    }

}