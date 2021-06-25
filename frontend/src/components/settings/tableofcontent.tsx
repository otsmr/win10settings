import React from 'react';

import Translate from "../../utilitis/translate"
import A from "./forms/a"

import search from "../../utilitis/search"
import socket from '../../utilitis/socket';

const BSI_BERICHT_LINK = "https://web.archive.org/web/20190911091237/https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Cyber-Sicherheit/SiSyPHus/Analyse_Telemetriekomponente.pdf?__blob=publicationFile&v=5";

function BSIInfo () {
    return (
        <div>
            <h1>Mehr Informationen</h1>
            <p>Analyse vom BSI der Telemetriekomponente in Windows 10</p>
            <A href={BSI_BERICHT_LINK}>Zum Bericht</A>
            <br /> <br /> <br />
        </div>
    )
}

const content = [
    {
        title: "S_PRIVACY_TITLE",
        icon: "lock",
        id: "privacy",
        desc: "S_PRIVACY_DESC",
        children: [
            {
                title: "TELEMETRIE",
                id: "telemetrie",
                icon: "hearing",
                sidebar: (
                    <div className="sidebar">
                        <BSIInfo />
                        <h1>Quellenangaben</h1>
                        <p>
                            1. <A href={BSI_BERICHT_LINK}>BSI-Bericht (3.1.1)</A><br />
                            2. <A href={BSI_BERICHT_LINK}>BSI-Bericht (3.1.5)</A><br />
                            3. <A href="https://docs.microsoft.com/de-de/windows/privacy/configure-windows-diagnostic-data-in-your-organization">Microsoft Docs</A><br />
                            4. <A href="https://docs.microsoft.com/de-de/windows/privacy/manage-connections-from-windows-operating-system-components-to-microsoft-services#1816-feedback-und-diagnose1816-feedback--diagnostics">Microsoft Docs (18.16)</A><br />
                            5. <A href="https://docs.microsoft.com/de-de/windows/privacy/manage-connections-from-windows-operating-system-components-to-microsoft-services#bkmk-general">Microsoft Docs (18.1)</A><br />                 
                            6. <A href="https://www.der-windows-papst.de/2015/12/24/windows-10-spy-deaktivieren/">Jörn Walter</A><br />
                            7. <A href="https://support.microsoft.com/de-de/help/4028485/windows-10-add-an-exclusion-to-windows-security">Microsoft Docs ("Add an exclusion to Windows Security")</A><br />
                            8. <A href="https://support.microsoft.com/en-us/help/2764944/hosts-file-is-detected-as-malware-in-windows-defender">Microsoft Docs ("Hosts file is detected as malware in Windows Defender")</A>
                        </p>
                    </div>
                )
            },
            {
                title: "WINDOWS_DEFENDER",
                id: "defender",
                icon: "security",
                sidebar: (
                    <div className="sidebar">
                        <BSIInfo />
                        <h1>Quellenangaben</h1>
                        <p>
                            1. <A href={BSI_BERICHT_LINK}>BSI-Bericht (3.1.3)</A><br />
                            2. <A href="https://docs.microsoft.com/de-de/windows/client-management/mdm/policy-csp-defender#defender-submitsamplesconsent">Microsoft Docs</A></p>
                    </div>
                )
            },
            {
                title: "SERVICES",
                id: "services",
                icon: "brightness_low",
                sidebar: (
                    <div className="sidebar">
                        <BSIInfo />
                        <h1>Quellenangaben</h1>
                        <p>
                            1. <A href={BSI_BERICHT_LINK}>BSI-Bericht (3.1.2)</A><br />
                            2. <A href="https://www.der-windows-papst.de/2018/07/22/windows-datensammlung-per-powershell-deaktivieren/">Jörn Walter</A></p>
                    </div>
                )
            },
            {
                title: "CORTANA_BING",
                id: "cortana",
                icon: "keyboard_voice",
                sidebar: (
                    <div className="sidebar">
                        <h1>Quellenangaben</h1>
                        <p>
                            1. <A href="https://www.heise.de/newsticker/meldung/Windows-10-Version-1803-Microsoft-aendert-Abschalten-der-Web-Suche-4015544.html">Heise Online</A><br />
                            2. <A href="https://www.csoonline.com/article/2641599/microsoft-hosts-file-bypass-issue.html">MS HOSTS file bypass issue</A><br />
                            3. <A href="https://support.microsoft.com/de-de/help/4028485/windows-10-add-an-exclusion-to-windows-security">Microsoft Docs ("Add an exclusion to Windows Security")</A><br />
                            4. <A href="https://support.microsoft.com/en-us/help/2764944/hosts-file-is-detected-as-malware-in-windows-defender">Microsoft Docs ("Hosts file is detected as malware in Windows Defender")</A>
                        </p>
                    </div>
                )
            },
            {
                title: "ADS",
                id: "ads",
                icon: "shopping_cart",
                sidebar: (
                    <div className="sidebar">
                        <h1>Quellenangaben</h1>
                        <p>
                            1. <A href="https://blog.danic.net/how-windows-10-pro-installs-unwanted-apps-candy-crush-and-how-you-stop-it/">Daniel's IT Blog</A><br />
                            2. <A href="https://techjourney.net/disable-show-suggestions-occasionally-in-start-in-windows-10/">Tech Journey</A>
                        </p>
                    </div>
                )
            }
        ]
    },
    {
        title: "S_PERSONALIZATION_TITLE",
        icon: "brush",
        id: "personalization",
        desc: "S_PERSONALIZATION_DESC",
        children: [
            {
                title: "TASKBAR",
                id: "taskbar",
                icon: "call_to_action", 
                sidebar: (
                    <div className="sidebar">
                        <h1>Weitere Optionen</h1>
                        <p>
                            <button className="btn" onClick={()=>{socket.post({id: "explorer", method: "restart"}, _ => {})}}>Explorer neu starten</button>
                        </p>
                        <br />
                        <br />
                        <h1>Links</h1>
                        <p>
                            <A href="https://github.com/otsmr/launcher">Launcher herunterladen</A>
                        </p>
                    </div>
                )
            }
        ]
    },
    {
        title: "S_EXPLORER_TITLE",
        icon: "folder",
        id: "explorer",
        desc: "S_EXPLORER_DESC",
        children: [
            {
                title: "FOLDERSHORTCUTS",
                id: "shortcuts",
                icon: "folder_special",
                sidebar: (
                    <div className="sidebar">
                        <h1>Quellenangaben</h1>
                        <p>
                            1. <A href="https://www.der-windows-papst.de/wp-content/uploads/2019/07/Dieser-PC-in-der-Ansicht-entschlacken.pdf">Jörn Walter</A>
                        </p>
                    </div>
                )
            },
            {
                title: "FOLDEROPTIONS",
                id: "folderoptions",
                icon: "settings"
            }
        ]
    },
    {
        title: "S_WINAPPS_TITLE",
        icon: "format_list_numbered",
        id: "programs",
        desc: "S_WINAPPS_DESC",
        children: [
            {
                title: "WINDOWS_APPS",
                id: "winapps",
                icon: "format_list_numbered",
                sidebar: (
                    <div className="sidebar">
                        <h1>Quellenangaben</h1>
                        <p>
                            1. <A href="https://docs.microsoft.com/de-de/windows/application-management/apps-in-windows-10">Microsoft Docs</A><br />
                            2. <A href="https://blog.danic.net/provisioned-app-packages-in-windows-10-enterprise-windows-10-pro/">Daniel's IT Blog</A>
                        </p>
                    </div>
                )
            },
            // {
            //     title: "MS_OFFICE",
            //     id: "office",
            //     icon: "insert_drive_file"
            // },
            // {
            //     title: "RECOMMENDATIONS",
            //     id: "feedback",
            //     icon: "emoji_objects"
            // }
        ]
    },
    {
        title: "S_SSD_TITLE",
        icon: "save",
        id: "ssd",
        desc: "S_SSD_DESC",
        children: [
            {
                title: "ENERGYSAVER",
                id: "energysaver",
                icon: "eco",
                sidebar: (
                    <div className="sidebar">
                        <h1>Quellenangaben</h1>
                        <p>
                            1. <A href="https://www.thomas-krenn.com/de/wiki/Windows_f%C3%BCr_SSDs_optimieren">Thomas Krenn</A>
                        </p>
                    </div>
                )
            }
        ]
    },
    {
        title: "TOOLS",
        icon: "developer_board",
        id: "tools",
        desc: "S_TOOLS_DESC",
        children: [
            {
                title: "FILE_HASHER",
                id: "filehasher",
                icon: "memory",
                sidebar: (
                    <div className="sidebar">
                        <h1>Quellenangaben</h1>
                        <p>1. <A href="https://www.der-windows-papst.de/2018/01/01/windows-rechtsklick-datei-hash-erzeugen/">Jörn Walter</A></p>
                    </div>
                )
            },
            {
                title: "FIREWALL",
                id: "firewall",
                icon: "fireplace",
                sidebar: (
                    <div className="sidebar">
                        <h1>Quellenangaben</h1>
                        <p></p>
                    </div>
                )
            }
        ]
    },
    {
        title: "S_APP_TITLE",
        icon: "settings",
        id: "app",
        desc: "S_APP_DESC",
        children: [
            {
                title: "GENERAL",
                id: "gereral",  // -> Logs, Export Powershell Commands
                icon: "settings"
            },
            {
                title: "UPDATE",
                id: "update",
                icon: "update"
            },
            {
                title: "FEEDBACK",
                id: "feedback",
                icon: "feedback"
            },
            // {
            //     title: "ABOUT",
            //     id: "about",
            //     icon: "info"
            // }
        ]
    }
]

class TableOfContent {

    T: Translate;
    content: {
        title: string,
        id: string,
        desc: string,
        icon: string
        children?: {
            title: string,
            id: string,
            icon: string,
            sidebar?: JSX.Element
        }[]
    }[] = content;

    constructor (T: Translate) {
        this.T = T;

        this.content.forEach(item => {
            item.title = this.T.t(item.title);
            item.desc = this.T.t(item.desc);
            item.id = "page:" + item.id;
            if (item.children) {
                item.children.forEach(child => {
                    child.title = this.T.t(child.title);
                    child.id = item.id + ":" + child.id 
                })
            }
        });

    }
    
    get categories () {
        return this.content;
    }

    getCategoriesByID (id: string) {
        return this.content.find(e => e.id === id);
    }

    searchChildren (query: string) {

        let children: any[] = [];

        this.content.forEach(item => {

            if (!item.children) return;

            const cloned = JSON.parse(JSON.stringify(item.children));
            children = children.concat(cloned)
            
        })

        return search.list(query, children, "title");
    }

    getFirtChildByPageID (pageID: string) {

        const pageIDSplited = pageID.split(":");

        if (pageIDSplited.length !== 2) return null;

        const categorie = this.getCategoriesByID(`${pageIDSplited[0]}:${pageIDSplited[1]}`);

        if (!categorie?.children) return null;
        
        return categorie.children[0];

    }

    getNavItemsByPageID (pageID: string) {

        const pageIDSplited = pageID.split(":");

        const categorie = this.getCategoriesByID(`${pageIDSplited[0]}:${pageIDSplited[1]}`);

        if (!categorie) return null;

        return {
            title: categorie?.title,
            items: (categorie?.children) ? categorie?.children.map(e => {
                return {
                    title: e.title,
                    id: e.id,
                    icon: e.icon
                }
            }) : []
        };

    }

    getChildrenByID (pageID: string) {

        const pageIDSplited = pageID.split(":");

        if (pageIDSplited.length !== 3) return null;

        const categorie = this.getCategoriesByID(`${pageIDSplited[0]}:${pageIDSplited[1]}`);

        if (!categorie?.children) return null;
        
        return categorie.children.find(e => e.id === pageID);

    }

    getSideBarByID (pageID: string) {

        const item = this.getChildrenByID(pageID);
        
        if (!item || !item.sidebar) return null;

        return item.sidebar;

    }

}

export default TableOfContent;