import React from "react";
import socket from "./../utilitis/socket"

interface IProps {
    title: string
}

export default class Titlebar extends React.Component<IProps> {

    toggleMaximize () {

        const element:any = this.refs.toggleMax;
        const classList = element.classList;

        socket.emit("window", "toggleMaximize", (isMaximized: boolean) => {

            if (isMaximized) {
                classList.remove("window-maximize");
                classList.add("window-unmaximize");
            } else {
                classList.add("window-maximize");
                classList.remove("window-unmaximize");
            }

        })

        classList.toggle("window-maximize");
        classList.toggle("window-unmaximize");
        
    }

    render () {

        return (
            <div className="window-titlebar">
                <div className="titlebar-drag-region"></div>
                <div className="window-title"><div className="appIcon" style={{ display: 'none' }}></div><div>{this.props.title || ""}</div></div>
                <div className="window-controls-container">
                    <div className="window-icon-bg" onClick={() => { socket.emit("window", "minimize") }}>
                        <div className="window-icon window-minimize"></div>
                    </div>
                    <div className="window-icon-bg" onClick={() => { this.toggleMaximize() }}>
                        <div ref="toggleMax" className="window-icon window-max-restore window-maximize"></div>
                    </div>
                    <div className="window-icon-bg window-close-bg" onClick={() => { socket.emit("window", "close") }}>
                        <div className="window-icon window-close"></div>
                    </div>
                </div>
            </div>
        )
        
    }

}