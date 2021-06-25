import React from "react";

import "../../../assets/style/forms/list.sass"

import avatar from "../../../assets/img/avatar.svg"

interface IProps {
    onChange: any,
    checked: boolean,
    id: string
}
interface IState {
    checked: boolean
}

class Checkbox extends React.Component<IProps, IState> {

    constructor (props: IProps) {
        super(props);

        this.state =  {
            checked: this.props.checked
        }
    }

    onChange = () => {

        const input: any = this.refs.input;

        this.setState({ checked: input.checked, })

        setTimeout(() => {
            this.props.onChange(this.props.id, this.state.checked);
        }, 20);

    }

    render () {
        return (
            <input ref="input" type="checkbox" onChange={this.onChange} checked={this.state.checked} data-checked={this.state.checked} />
        )
    }

}

export default function Liste (props: {
    listitems: {
        id: string,
        title: string,
        icon?: string,
        desc?: string,
        checked?: boolean
    }[],
    width?: string,
    checkbox: boolean,
    onChange: Function
}) {

    const style = {
        gridTemplateColumns: `50px ${(props.width) ? props.width : "350px"} 50px`
    }

    return (
        <div className="list-container">

            { props.listitems.map(e => {
                const icon = (e.icon) ? e.icon : avatar;
                return (
                    <div key={e.id} className="list-item" style={style}>

                        <div className="icon">
                            <img alt="" src={icon} />
                        </div>

                        <div className="content">  
                            <h3>{e.title}</h3>
                            { (e.desc) ? ( <p>{e.desc}</p> ) : ""}
                        </div>

                        <Checkbox id={e.id} onChange={props.onChange} checked={(e.checked) ? true : false} />

                    </div>
                )
            })}

        </div>
    )
}