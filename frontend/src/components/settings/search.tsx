import React from 'react';

import FluentItem from "../design/fluent"
import TableOfContent from "./tableofcontent"
import "./../../assets/style/components/search.sass";

function Suggestion (props: {
    changeActivePage: Function,
    pageID: string,
    title: string,
    icon: string
}) {
    return (
        <li tabIndex={0}>
            <FluentItem 
                useBorder={false}
                lightColor="var(--suggestion-fluent-light-color)"
                backgroundColor="var(--suggestion-background)"
                contentBackgroundColorHover="var(--suggestion-background-hover)" 
                key={props.pageID}
                borderColor="var(--fluent-border-color)"
                gradientSize={50}
                onClick={() => { props.changeActivePage(props.pageID) }}>

                <div className="icon">
                    <i className="m-icon">{props.icon}</i>
                </div>
                <span>{props.title}</span>

            </FluentItem>
        </li>

    )
}

interface ISuggestionProps {
    tableOfContent: TableOfContent,
    changeActivePage: Function,
    for: string
}

class Suggestions extends React.Component<ISuggestionProps> {

    componentDidUpdate () {

        const element: any = this.refs.suggestion;
        const elementlist: any = this.refs.list;
        element.style.display = "block";

        if (elementlist.children.length === 0) {
            element.style.display = "none";
        }

    }

    render () {

        let suggestion = this.props.tableOfContent.searchChildren(this.props.for);
        suggestion = suggestion.slice(0, 5);

        return (
            <div ref="suggestion" className="suggestion">
                <ul ref="list">
                    {
                        suggestion.map(item => {
                            return <Suggestion key={Math.random()} changeActivePage={this.props.changeActivePage} pageID={item.id} icon={item.icon} title={item.title} />
                        })
                    }
                </ul>
            </div>
        )

    }

}

interface IProps {
    placeholder: string,
    tableOfContent: TableOfContent,
    changeActivePage: Function
}

interface IState {
    searchIcon: string,
    inputValue: string
}

export default class Search extends React.Component<IProps, IState> {

    constructor (props: IProps) {
        super(props);

        this.state = {
            searchIcon: "search",
            inputValue: ""
        }

    }

    focusInput = () => {
        const input: any = this.refs.input;
        input.focus();
    }

    componentDidMount () {
        this.focusInput();
    }

    componentDidUpdate () {
        this.focusInput();
    }
    
    render () {

        return (

            <div className="search">
                <div className="input">
                    <input autoFocus ref="input" value={this.state.inputValue} onChange={this.onInputChange} placeholder={this.props.placeholder} type="text"/>
                    <div className="icon" onClick={this.iconClicked}>
                        <i className="m-icon">{this.state.searchIcon}</i>
                    </div>
                </div>
                <Suggestions changeActivePage={(pageID: string) => {
                    this.setState({
                        inputValue: ""
                    });
                    this.props.changeActivePage(pageID);
                }} for={this.state.inputValue} tableOfContent={this.props.tableOfContent} />
            </div>

        )

    }

    updateIcon ()  {

        setTimeout(() => {

            let searchIcon = "search"
            if (this.state.inputValue !== "") 
                searchIcon = "close";

            this.setState({ searchIcon });

        }, 10);

    }

    onInputChange = (event: any) => {

        this.setState({ 
            inputValue: event.target.value
        });

        this.updateIcon();
        
    }

    iconClicked = () => {

        this.setState({ inputValue: "" });

        this.focusInput();
        this.updateIcon();

    }

}