import React from 'react';

import "./../../../assets/style/components/navigation.sass";

import Translate from "../../../utilitis/translate"
import FluentItem from "../../design/fluent"

import TableOfContent from "./../tableofcontent"
import Search from "../search";


function NavigationItems (props: {
    listOfContent: {
        icon: string,
        id: string,
        title: string
    }[],
    changeActivePage: Function,
    pageid: string
}) {
    return (
        <ul className="navigationitems">
            {props.listOfContent.map(item => {
                return (
                    <li key={item.id} className={(props.pageid === item.id) ? "active" : ""}>
                        <FluentItem 
                            useBorder={false}
                            lightColor="var(--navigation-fluent-light-color)"
                            backgroundColor="var(--navigation-background)"
                            contentBackgroundColorHover="var(--navigation-background-hover)" 
                            key={item.id}
                            borderColor="var(--fluent-border-color)"
                            gradientSize={50}
                            onClick={() => { props.changeActivePage(item.id) }}>

                            <div className="icon">
                                <i className="m-icon">{item.icon}</i>
                            </div>
                            <p>{item.title}</p>

                        </FluentItem>
                    </li>
                )
            })}
        </ul>
    )
}

interface IProps {
    T: Translate,
    pageid: string,
    tableOfContent: TableOfContent,
    changeActivePage: Function
}

export default class extends React.Component<IProps> {

    render () {

        const navItems = this.props.tableOfContent.getNavItemsByPageID(this.props.pageid);

        const start = [{
            icon: "home",
            id: "startpage",
            title: "Startseite"
        }]

        return (

            <div className="navigation">

                <NavigationItems pageid={this.props.pageid} listOfContent={start} changeActivePage={this.props.changeActivePage}/>

                <div className="search-container">
                    <Search tableOfContent={this.props.tableOfContent} changeActivePage={this.props.changeActivePage} placeholder={this.props.T.t("SETTINGS_SEARCH_PLACEHOLDER")}/>
                </div>

                { (navItems) ? (
                     <h3>{navItems.title}</h3>
                ): ""}
                
                {(navItems) ? (
                    <NavigationItems pageid={this.props.pageid} listOfContent={navItems.items} changeActivePage={this.props.changeActivePage}/>
                ): "" }

            </div>

        )

    }

}