import React from "react";
import socket from "./../../../utilitis/socket";

export default function a (props: {href: string, children: any, className?: string}) {
    return (
        <button className={"btn-link " + (props.className || "")} onClick={()=>{
            socket.post({id: "href", method: "open", body: { url: props.href}}, _ => {})
        }}>
            {props.children}
        </button >
    )
}