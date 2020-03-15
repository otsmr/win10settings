import React from 'react';

import "../../../assets/style/components/pagewithnav/pagecontent.sass"

import PagePrivacyTelemetrie from "./page/privacy/telemetrie"
import PagePrivacyDefender from "./page/privacy/defender"
import PagePrivacyServices from "./page/privacy/services"
import PagePrivacyAds from "./page/privacy/ads"
import PagePrivacyCortana from "./page/privacy/cortana"

import PagePersonalizationTaskbar from "./page/personalization/taskbar"

import PageProgramsWinapps from "./page/programs/winapps"

import PageSSDEnergysaver from "./page/ssd/energysaver"

import PageExplorerShortcuts from "./page/explorer/shortcuts"
import PageExplorerFolderoptions from "./page/explorer/folderoptions"

import PageToolsFilehasher from "./page/tools/filehasher"
import PageToolsFirewall from "./page/tools/firewall"

import PageAppUpdate from "./page/app/update"
import PageAppFeedback from "./page/app/feedback"
import PageAppGeneral from "./page/app/gereral"


const pagesByPageID: any = {
    "page:privacy:telemetrie": PagePrivacyTelemetrie,
    "page:privacy:defender": PagePrivacyDefender,
    "page:privacy:services": PagePrivacyServices,
    "page:privacy:ads": PagePrivacyAds,
    "page:privacy:cortana": PagePrivacyCortana,
    "page:programs:winapps": PageProgramsWinapps,
    "page:app:update": PageAppUpdate,
    "page:explorer:shortcuts": PageExplorerShortcuts,
    "page:explorer:folderoptions": PageExplorerFolderoptions,
    "page:tools:filehasher": PageToolsFilehasher,
    "page:tools:firewall": PageToolsFirewall,
    "page:personalization:taskbar": PagePersonalizationTaskbar,
    "page:ssd:energysaver": PageSSDEnergysaver,
    "page:app:feedback": PageAppFeedback,
    "page:app:gereral": PageAppGeneral
}


interface IProps {
    pageid: string,
    title: string
}

export default class extends React.Component<IProps> {

    getPage () {

        const PageContent = pagesByPageID[this.props.pageid]; 

        if (!PageContent) return null;

        return (
            <PageContent />
        )

    }

    render () {

        return (
            <div className="page-content">
                <h1>{this.props.title}</h1>
                {this.getPage()}
            </div>
        )

    }

}