import React from 'react'

import "../../assets/style/components/pagewithnav.sass"
import "../../assets/style/components/pagewithnav/sidebar.sass"

import Translate from "../../utilitis/translate"
import Navigation from "./pagewithnav/navigation"
import PageContent from "./pagewithnav/pagecontent"

import TableOfContent from "./tableofcontent"

interface IProps {
    T: Translate,
    pageID: string,
    tableOfContent: TableOfContent,
    changeActivePage: Function
}

export default class extends React.Component<IProps> {
   
    render() {

        const content = this.props.tableOfContent;

        const children = content.getChildrenByID(this.props.pageID);
        const pageTitle: string = (children) ? children.title : "";

        let sidebar = content.getSideBarByID(this.props.pageID);
        if (!sidebar) sidebar = null;

        return (

            <div className="pageWithNav noselect">
                <Navigation T={this.props.T} pageid={this.props.pageID} changeActivePage={this.props.changeActivePage} tableOfContent={this.props.tableOfContent} />
                <div className="pageContentWithSidebar">
                    <PageContent pageid={this.props.pageID} title={pageTitle} />
                    {sidebar}
                </div>
            </div>
 
        )

    }

}