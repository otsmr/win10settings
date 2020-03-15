import React from "react";
import "../../assets/style/design/fluent.sass";

interface IProps {
    lightColor: string,
    backgroundColor: string,
    contentBackgroundColorHover: string,
    gradientSize: number,
    borderColor: string,
    useBorder: boolean
    onClick: Function
}

export default class extends React.Component<IProps> {

    isMouseOver: boolean = false;

    componentDidMount () {

        const container: any = this.refs.container;
        const content: any = this.refs.content;

        let stopTimeOut: boolean = false;

        let mousePositionXY: string = "";

        const setPosition = (e: MouseEvent) => {
            const { left, top } = container.getBoundingClientRect();
            mousePositionXY = (e.pageX - left) + ' ' + (e.pageY - top);
        }

        window.addEventListener('mousemove', e => {
            setPosition(e);
            updateGradient();
        });
        window.addEventListener('mouseup', e => {
            stopTimeOut = true;
            container.dataset.mousedown = "false";
            setPosition(e);
            updateGradient();
        });

        const updateGradient = () => {
            
            if (container.dataset.mousedown === "true") return;
            
            container.style.background = `-webkit-gradient(radial, ${mousePositionXY}, 0, ${mousePositionXY}, ${this.props.gradientSize}, from(${this.props.lightColor}), to(rgba(0,0,0,0.0))), ${this.props.backgroundColor}`;
        
        }

        container.style.background = this.props.backgroundColor;
        content.style.background = this.props.backgroundColor;

        container.addEventListener("mouseenter", () => {
            content.className += " hover"; 
            container.style.border = `${(this.props.useBorder) ? "1" : "0"}px solid ${this.props.borderColor}`
            content.style.background = this.props.contentBackgroundColorHover;
        })
        container.addEventListener("mouseleave", () => {
            content.style.background = this.props.backgroundColor;
            content.className = content.className.replace(" hover", "");
            container.dataset.mouseenter = "false";
            container.style.border = `unset`
        });

        container.addEventListener("mousedown", () => {

            stopTimeOut = false;

            container.dataset.mousedown = "true";

            const style = getComputedStyle(document.body);
            let lightColor = style.getPropertyValue(this.props.lightColor.replace("var(", "").replace(")", ""));

            const colors: any = lightColor.replace(/ /g, "").replace(")", "").split(",");

            colors[3] = parseFloat(colors[3]) + .2

            const next = (count: number) => {

                if (stopTimeOut || count >= 2000) return;

                colors[3] -= .0015
                const gradientSize = count / 5

                lightColor = `${colors.join(",")})`;

                container.style.background = `-webkit-gradient(radial, ${mousePositionXY}, 0, ${mousePositionXY}, ${gradientSize}, from(${lightColor}), to(rgba(0,0,0,0.0))), ${this.props.backgroundColor}`;

                setTimeout(() => {
                    count += 3 + count / 100;
                    next(count);
                }, 1);

            }

            next(this.props.gradientSize);

        });

    }

    componentDidUpdate () {
        const container: any = this.refs.container;
        container.style.background = "";
    }

    render () {

        return (
            <div ref="container" tabIndex={0} className="tile noselect fluent-container" onClick={()=>{this.props.onClick()}} >
                <div  ref="content" className="content fluent-content" data-useborder={this.props.useBorder} >
                    { this.props.children }
                </div>
            </div>
        )
    }

}