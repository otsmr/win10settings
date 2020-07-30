import React from "react";
import socket from "./../../../utilitis/socket";

export default (props: {href: string, children: any, className?: string}) => {
    return (
        <button className={"btn-link " + (props.className || "")} onClick={()=>{
            socket.emit("openUrl", props.href)
        }}>
            {props.children}
        </button >
    )
}