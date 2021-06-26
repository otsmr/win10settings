import React from 'react';

import './../../assets/style/components/window.sass';
import './../../assets/style/components/settings.sass';
import './../../assets/style/variables.scss';

import Startpage from "./startpage";
import PageWithNav from "./pagewithnav";

import DefaultLocalization from "../../localization/de_DE.json"

import de_DE from "../../localization/de_DE.json"
import en_US from "../../localization/en_US.json"

import Translate from "../../utilitis/translate"
import TableOfContent from "./tableofcontent";

import socket from '../../utilitis/socket';
import { syncThemeMode } from '../../utilitis/utils';

const T = new Translate({}, {})

interface IProps {}

interface IState {
    languageCode: string,
    activePageID: string;
}

export default class Window extends React.Component<IProps, IState> {

    tableOfContent: TableOfContent

    constructor (prop: IProps ) {
        super(prop)

        this.state = {
            languageCode: "de_DE",
            activePageID: "startpage"
        }
        socket.post({id: "app:config:language", method: "get", }, this.updateLanguage);
        // socket.on("changeLanguage", this.updateLanguage);
        
        let languageCode: string = localStorage.getItem("languageCode") || "de_DE";
        this.updateLanguage(false, languageCode);

        this.tableOfContent = new TableOfContent(T);

        syncThemeMode();
        
    }

    updateLanguage = (err: boolean, newLanguageCode: string) => {
        if (err) return;

        let languageCode: string = localStorage.getItem("languageCode") || "de_DE";

        if (languageCode !== newLanguageCode) {
            localStorage.setItem("languageCode", newLanguageCode);
            // TODO: reload
            // (window as any).location.reload();
            return;
        }

        let languageData = {};
        switch (languageCode) {
            case "de_DE": languageData = de_DE; break;
            case "en_US": languageData = en_US; break;
        }
        T.setLocalizationData(languageData, DefaultLocalization);

    }

    componentDidMount () {
        
        const content:any = this.refs.content;
        const windowload:any = this.refs.windowload;
        
        setTimeout(() => {
            windowload.remove();
            content.classList.add("loaded");
        }, 250);
            
    }

    changeActivePage = (pageID: string) => {

        if (pageID === this.state.activePageID) return;

        const content:any = this.refs.content;

        const idSplited = pageID.split(":");
        const activePageIDSplited = this.state.activePageID.split(":");

        if (
            (activePageIDSplited[0] === "startpage" && idSplited[0] !== "startpage") || 
            (activePageIDSplited[0] !== "startpage" && idSplited[0] === "startpage")
        ) {
            content.classList.remove("loaded");
        }

        if (idSplited[0] === "page" && idSplited.length === 2) {
            const firstChild = this.tableOfContent.getFirtChildByPageID(pageID);
            if (firstChild) pageID = firstChild.id;
        }

        setTimeout(() => {
            content.classList.add("loaded");
        }, 20);

        this.setState({
            "activePageID": pageID
        })

    }

    isSection = (pageID:string) => {
        return (this.state.activePageID.split(":")[0] === pageID)
    }

    render() {

        return (
            
            <div className="window-root">

                <div ref="windowload" className="window-load"></div>

                <div ref="content" className="window-content">

                    <div className="contentSection" data-active={this.isSection("startpage")}>
                        <Startpage T={T} changeActivePage={this.changeActivePage} tableOfContent={this.tableOfContent} />
                    </div>

                    <div className="contentSection" data-active={this.isSection("page")}>
                        <PageWithNav T={T} pageID={this.state.activePageID} changeActivePage={this.changeActivePage}  tableOfContent={this.tableOfContent} />
                    </div>
                    
                </div>

            </div>

        )

    }

}