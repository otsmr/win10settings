import socket from "./socket";


export function syncThemeMode () {

    socket.post({id: "app:config:theme", method: "get"}, (error: boolean, value: string) => {

        const html: any = document.querySelector(":root");
        let theme = value;
    
        if (value === "system") {
            theme = (window.matchMedia('(prefers-color-scheme: dark)').matches) ? "dark" : "light";
        }
    
        html?.setAttribute("theme", theme);

    });


}