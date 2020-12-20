
const apiUrl = "http://127.0.0.1:13253";

export default {


    emit (id: string, a: any = null, b: any = null, c: any = null, d: any = null) {

        const rand = parseInt(String(Math.random()).split(".")[1]);

        let func:any = ()=>{};
        if (typeof a === "function") {func = a; a = null;};
        if (typeof b === "function") {func = b; b = null;};
        if (typeof c === "function") {func = c; c = null;};
        if (typeof d === "function") {func = d; d = null;};


        // (window as any).ipcRenderer.send(id, rand, a, b, c, d);
        // (window as any).ipcRenderer.on(id + rand, (event: any, a: any, b: any, c: any, d: any) => {
        //     func(a, b, c, d);
        // });

        console.log("TODO::", "POST", a?.toString(), b?.toString(), c?.toString(), d?.toString());

    },

    on (id: string, call: Function) {

        console.log("TODO::", "LISTENER", id, call.toString());
        return;

        (window as any).ipcRenderer.on(id, (event: any, rand: any, a: any, b: any, c: any, d: any) => {
            if (a === null) call((a: any, b: any, c: any, d: any) => { event.reply(id+rand, a,b,c,d); });
            else if (b === null) call(a, (a: any, b: any, c: any, d: any) => { event.reply(id+rand, a,b,c,d); });
            else if (c === null) call(a, b, (a: any, b: any, c: any, d: any) => { event.reply(id+rand, a,b,c,d); });
            else if (d === null) call(a, b, c, (a: any, b: any, c: any, d: any) => { event.reply(id+rand, a,b,c,d); });                
        })

    }

}