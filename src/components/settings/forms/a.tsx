import React from "react";
import socket from "./../../../utilitis/socket";

export default (props: {href: string, children: any}) => {
    return (
        <button className="btn-link" onClick={()=>{
            socket.emit("openUrl", props.href)
        }}>
            {props.children}
        </button >
    )
}